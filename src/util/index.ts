import {saveAs} from "file-saver";

/**
 * 将字节大小转换为其他单位（KB、MB、GB）
 * @param bytes - 文件大小（字节）
 * @param decimals - 保留的小数位数
 * @returns 转换后的文件大小字符串
 */
export  function convertBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * 下载图片
 * @param url
 * @param fileName
 */
export function downloadImage(url: string, fileName: string) {
  if (!url) {
    return
  }
  saveAs(url, fileName)
}

