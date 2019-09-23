import request from '@/utils/request'

/**
 * 获取所有频道列表
 */
export const getAllChannels = () => {
  return request({
    url: '/app/v1_0/channels',
    method: 'get'
  })
}
// 获取用户频道列表或者默认推荐的频道列表
export const getUserOrDefaultChannels = () => {
  return request({
    method: 'get',
    url: '/app/v1_0/user/channels'
  })
}
