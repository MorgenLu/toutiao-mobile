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
