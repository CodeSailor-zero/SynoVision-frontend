// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** health GET /SynoVision/health */
export async function healthUsingGet(options?: { [key: string]: any }) {
  return request<string>('/SynoVision/health', {
    method: 'GET',
    ...(options || {}),
  })
}
