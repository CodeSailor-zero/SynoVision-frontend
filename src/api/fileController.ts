// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** testDownload POST /SynoVision/file/test/download */
export async function testDownloadUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.testDownloadUsingPOSTParams,
  options?: { [key: string]: any }
) {
  return request<any>('/SynoVision/file/test/download', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** testUpload POST /SynoVision/file/test/upload */
export async function testUploadUsingPost(body: {}, file?: File, options?: { [key: string]: any }) {
  const formData = new FormData()

  if (file) {
    formData.append('file', file)
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele]

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''))
        } else {
          formData.append(ele, JSON.stringify(item))
        }
      } else {
        formData.append(ele, item)
      }
    }
  })

  return request<API.BaseResponseString_>('/SynoVision/file/test/upload', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  })
}
