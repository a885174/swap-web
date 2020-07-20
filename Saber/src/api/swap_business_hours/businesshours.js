import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/swap_business_hours/businesshours/list',
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
    url: '/api/swap_business_hours/businesshours/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/swap_business_hours/businesshours/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/swap_business_hours/businesshours/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/swap_business_hours/businesshours/submit',
    method: 'post',
    data: row
  })
}


export const getPage = (storeId) => {
  return request({
    url: '/api/swap_business_hours/businesshours/select',
    method: 'get',
    params: {
      storeId
    }
  })
}