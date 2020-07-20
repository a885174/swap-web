import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/swap_user/wapuser/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (userId) => {
  return request({
    url: '/api/swap_user/wapuser/detail',
    method: 'get',
    params: {
      userId
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/swap_user/wapuser/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/swap_user/wapuser/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/swap_user/wapuser/submit',
    method: 'post',
    data: row
  })
}


export const importxls = () => {
  return request({
    url: '/api/swap_user/wapuser/exportExcel',
    method: 'post',
    responseType:'blob'
  })
}

export const del = (ids,userStatus) => {
  return request({
    url: '/api/swap_user/wapuser/del',
    method: 'post',
    params: {
      ids,
      userStatus
    }
  })
}