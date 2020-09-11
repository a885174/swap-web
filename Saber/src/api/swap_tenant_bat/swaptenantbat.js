import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/swap_tenant_bat/swaptenantbat/page',
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
    url: '/api/swap_tenant_bat/swaptenantbat/detail',
    method: 'get',
    params: {
      tenantId
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/swap_tenant_bat/swaptenantbat/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/swap_tenant_bat/swaptenantbat/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/swap_tenant_bat/swaptenantbat/submit',
    method: 'post',
    data: row
  })
}

export const importxls = () => {
  return request({
    url: '/api/swap_tenant_bat/swaptenantbat/exportExcel',
    method: 'post',
    responseType:'blob'
  })
}


export const del = (ids,tenantStatus) => {
  return request({
    url: '/api/swap_tenant_bat/swaptenantbat/del',
    method: 'post',
    params:{
      ids,
      tenantStatus
    }    
  })
}


export const delSccoterList = (ids) => {
  return request({
    url: '/api/swap_tenant_bat/swaptenantbat/delSccoterList',
    method: 'post',
    params:{
      ids
    }    
  })
}

export const saveSccoterList = (ids,tenantId) => {
  return request({
    url: '/api/swap_tenant_bat/swaptenantbat/saveSccoterList',
    method: 'post',
    params:{
      ids,
      tenantId
    }    
  })
}

export const selectSccoterList = (current, size, params) => {
  return request({
    url: '/api/swap_scooter/scooter/select',
    method: 'Get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
