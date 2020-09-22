import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/swap_update/swapupdate/list',
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
    url: '/api/swap_update/swapupdate/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/swap_update/swapupdate/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/swap_update/swapupdate/save',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/swap_update/swapupdate/submit',
    method: 'post',
    data: row
  })
}

