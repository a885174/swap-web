import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/swap_merchant/merchant/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (merchantId) => {
  return request({
    url: '/api/swap_merchant/merchant/detail',
    method: 'get',
    params: {
      merchantId
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/swap_merchant/merchant/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/swap_merchant/merchant/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/swap_merchant/merchant/submit',
    method: 'post',
    data: row
  })
}

export const del = (ids,status) => {
  return request({
    url: '/api/swap_merchant/merchant/del',
    method: 'post',
    params: {
      ids,
      status
    }
  })
}





