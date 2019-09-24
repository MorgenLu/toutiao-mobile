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

// 新增用户频道

export const resetUserChannels = (channels) => {
  return request({
    method: 'put',
    url: '/app/v1_0/user/channels',
    data: {
      channels
    }
  })
}

// 删除用户频道

export const deleteUserChannel = target => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/channels/${target}`
  })
}
