import request from '@/router/axios';
export const getList = (current, size, params) => {
  return request({
    url: '/api/swap_tenant/tenant/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })

}

export const getDetail = (tenantId) => {
  return request({
    url: '/api/swap_tenant/tenant/detail',
    method: 'get',
    params: {
      tenantId
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/swap_tenant/tenant/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/swap_tenant/tenant/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/swap_tenant/tenant/submit',
    method: 'post',
    data: row
  })
}

