import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/test/station/online/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}