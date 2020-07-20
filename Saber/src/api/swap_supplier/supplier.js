import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/swap_supplier/supplier/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (supplierId) => {
  return request({
    url: '/api/swap_supplier/supplier/detail',
    method: 'get',
    params: {
      supplierId
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/swap_supplier/supplier/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/swap_supplier/supplier/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/swap_supplier/supplier/submit',
    method: 'post',
    data: row
  })
}


export const getDeptTree = (tenantId) => {
  return request({
    url: '/api/swap_supplier/supplier/tree',
    method: 'get',
    params: {
      tenantId,
    }
  })
}


