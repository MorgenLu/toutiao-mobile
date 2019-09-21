import request from '@/utils/request'

export const getArticles = ({
  channelId,
  timestamp,
  withTop
}) => {
  return request({
    url: '/app/v1_1/articles',
    method: 'get',
    params: {
      channel_id: channelId,
      timestamp,
      with_top: withTop
    }
  })
}
