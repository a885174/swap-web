import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/swap_scooter/scooter/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getPage = (current, size, params) => {
  return request({
    url: '/api/swap_scooter/scooter/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}


export const getDetail = (scooterId) => {
  return request({
    url: '/api/swap_scooter/scooter/detail',
    method: 'get',
    params: {
      scooterId
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/swap_scooter/scooter/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const SavueTeant = (ids,tenantId) => {
  return request({
    url: '/api/swap_scooter/scooter/SavueTeant',
    method: 'post',
    params: {
      ids,
      tenantId
    }
  })
}

export const del = (ids,type) => {
  return request({
    url: '/api/swap_scooter/scooter/del',
    method: 'post',
    params: {
      ids,
      type
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/swap_scooter/scooter/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/swap_scooter/scooter/submit',
    method: 'post',
    data: row
  })
}


export const edit = (row) => {
  return request({
    url: '/api/swap_scooter/scooter/update',
    method: 'post',
    data: row
  })
}




export const importxls = () => {
  return request({
    url: '/api/swap_scooter/scooter/exportExcel',
    method: 'post',
    responseType:'blob'
  })
}

export const downloadxls = () => {
  return request({
    url: '/api/swap_scooter/scooter/download',
    method: 'post',
    responseType:'blob'
  })
}


/**
 * 文件上传
 */
export const fileUpload = (fileobj)=> {
  let param = new FormData();
  param.append('files',fileobj.file)
  return request({
    method: 'post',
    url: '/api/swap_scooter/scooter/upload',
    headers: {'Content-Type':'multipart/form-data'},
    data: param
  })
}


export const getenantList = (current, size, params) => {
  return request({
    url: '/api/swap_tenant_bat/swaptenantbat/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })

}