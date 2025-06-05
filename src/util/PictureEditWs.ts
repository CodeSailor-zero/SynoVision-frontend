
export default class PictureEditWs {
  private pictureId: number
  private socket: WebSocket | null
  private eventHandlers: any
  private reconnectAttempts: number; // 记录重连次数
  private maxReconnectAttempts: number = 5; // 最大重连次数
  private reconnectInterval: number = 3000; // 重连间隔时间（毫秒）
  private manualClose: boolean = false; // 是否是用户主动关闭

  constructor(pictureId: number,manualClose : boolean) {
    this.pictureId = pictureId // 当前编辑的图片 ID
    this.socket = null // WebSocket 实例
    this.eventHandlers = {} // 自定义事件处理器
    this.reconnectAttempts = 0; // 记录重连次数
    this.manualClose = manualClose; // 是否是用户主动关闭

  }

  /**
   * 初始化 WebSocket 连接
   */
  connect() {
    const DEV_BASE_URL = 'ws://localhost:8009'
    // 线上地址
    // const PROD_BASE_URL = "ws://81.69.229.63";
    const url = `${DEV_BASE_URL}/SynoVision/ws/picture/edit?pictureId=${this.pictureId}`
    this.socket = new WebSocket(url)

    // 设置携带 cookie
    this.socket.binaryType = 'blob'

    // 监听连接成功事件
    this.socket.onopen = () => {
      console.log('WebSocket 连接已建立')
      this.reconnectAttempts = 0; // 重置重连次数
      this.manualClose = false; // 重置手动关闭标志
      this.triggerEvent('open')
    }

    // 监听消息事件
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data)
      console.log('收到消息:', message)

      // 根据消息类型触发对应事件
      const type = message.type
      this.triggerEvent(type, message)
    }

    // 监听连接关闭事件
    this.socket.onclose = (event) => {
      console.log('WebSocket 连接已关闭:', event)
      if (this.manualClose) {
        this.handleReconnect(); // 非主动关闭才触发重连
      } else {
        this.manualClose = false; // 重置标志
      }
      this.triggerEvent('close', event)
    }

    // 监听错误事件
    this.socket.onerror = (error) => {
      console.error('WebSocket 发生错误:', error)
      this.manualClose = true;
      this.socket?.close(); // 主动关闭连接以确保进入 onclose 回调
      this.triggerEvent('error', error)
    }
  }

  /**
   * 关闭 WebSocket 连接
   */
  closeconnect() {
    if (this.socket) {
      this.socket.close()
      console.log('WebSocket 连接已手动关闭')
    }
  }

  /**
   * 发送消息到后端
   * @param {Object} message 消息对象
   */
  sendMessage(message: object) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message))
      console.log('消息已发送:', message)
    } else {
      console.error('WebSocket 未连接，无法发送消息:', message)
    }
  }

  /**
   * 添加自定义事件监听
   * @param {string} type 消息类型
   * @param {Function} handler 消息处理函数
   */
  on(type: string, handler: (data?: any) => void) {
    if (!this.eventHandlers[type]) {
      this.eventHandlers[type] = []
    }
    this.eventHandlers[type].push(handler)
  }

  /**
   * 触发事件
   * @param {string} type 消息类型
   * @param {Object} data 消息数据
   */
  triggerEvent(type: string, data?: any) {
    const handlers = this.eventHandlers[type]
    if (handlers) {
      handlers.forEach((handler: any) => handler(data))
    }
  }

  /**
   * 处理重连逻辑
   */
  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      return;
    }


    setTimeout(() => {
      console.log(`正在尝试第 ${this.reconnectAttempts + 1} 次重连...`);
      this.reconnectAttempts++;
      this.connect(); // 重新连接
    }, this.reconnectInterval);
  }
}
