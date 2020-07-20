import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/swap_subscribe/subscribe/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (subscribeId) => {
  return request({
    url: '/api/swap_subscribe/subscribe/detail',
    method: 'get',
    params: {
      subscribeId
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/swap_subscribe/subscribe/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/swap_subscribe/subscribe/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/swap_subscribe/subscribe/submit',
    method: 'post',
    data: row
  })
}

