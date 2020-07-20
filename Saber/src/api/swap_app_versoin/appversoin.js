import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/swap_app_versoin/appversoin/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/swap_app_versoin/appversoin/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/swap_app_versoin/appversoin/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/swap_app_versoin/appversoin/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/swap_app_versoin/appversoin/submit',
    method: 'post',
    data: row
  })
}

