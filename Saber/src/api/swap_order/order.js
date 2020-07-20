import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/swap_order/order/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (orderId) => {
  return request({
    url: '/api/swap_order/order/detail',
    method: 'get',
    params: {
      orderId
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/swap_order/order/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/swap_order/order/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/swap_order/order/submit',
    method: 'post',
    data: row
  })
}

