import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/swap_area/area/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (areaId) => {
  return request({
    url: '/api/swap_area/area/detail',
    method: 'get',
    params: {
      areaId
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/swap_area/area/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/swap_area/area/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/swap_area/area/submit',
    method: 'post',
    data: row
  })
}

