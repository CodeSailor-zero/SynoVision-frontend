import axios from 'axios'
import { message } from 'ant-design-vue'
import { useLoginStore } from '@/stores/userLoginUserStore'

const myAxios = axios.create({
  baseURL: 'http://localhost:8009',
  timeout: 1000,
  withCredentials: true,
})

// 添加请求拦截器
myAxios.interceptors.request.use(
  function (config) {
    console.log('我要发请求了', config)
    // 在发送请求之前做些什么
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// 添加响应拦截器
myAxios.interceptors.response.use(
  function (response) {
    const loginUserStore = useLoginStore()
    // 请求日志
    console.log('我要接收后台响应了', response)
    const { data } = response
    console.log('亲贵', loginUserStore.loginUser)
    if (!loginUserStore.loginUser.id && !window.location.pathname.includes('/user/login')) {
      message.warning('请先登录')
      console.log('亲贵2', loginUserStore.loginUser)
      window.location.href = `/user/login?redirect=${window.location.href}`
    }

    // 对响应数据做点什么
    return response.data
  },
  function (error) {
    // 对响应错误做写什么
    return Promise.reject(error)
  },
)

export default myAxios
