// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** addSpaceUser POST /SynoVision/spaceMember/add */
export async function addSpaceUserUsingPost(
  body: API.SpaceMemberAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong_>('/SynoVision/spaceMember/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** deleteSpaceUser POST /SynoVision/spaceMember/delete */
export async function deleteSpaceUserUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/SynoVision/spaceMember/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** editSpaceUser POST /SynoVision/spaceMember/edit */
export async function editSpaceUserUsingPost(
  body: API.SpaceMemberEditRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/SynoVision/spaceMember/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getSpaceUser POST /SynoVision/spaceMember/get */
export async function getSpaceUserUsingPost(
  body: API.SpaceMemberQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseSpaceMember_>('/SynoVision/spaceMember/get', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** listSpaceUser POST /SynoVision/spaceMember/list */
export async function listSpaceUserUsingPost(
  body: API.SpaceMemberQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListSpaceMemberVo_>('/SynoVision/spaceMember/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** listMyTeamSpace POST /SynoVision/spaceMember/list/my */
export async function listMyTeamSpaceUsingPost(options?: { [key: string]: any }) {
  return request<API.BaseResponseListSpaceMemberVo_>('/SynoVision/spaceMember/list/my', {
    method: 'POST',
    ...(options || {}),
  })
}
