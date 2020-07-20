import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/swap_repair_business/repairbusiness/list',
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
    url: '/api/swap_repair_business/repairbusiness/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/swap_repair_business/repairbusiness/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/swap_repair_business/repairbusiness/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/swap_repair_business/repairbusiness/submit',
    method: 'post',
    data: row
  })
}


export const getPage = (storeId) => {
  return request({
    url: '/api/swap_repair_business/repairbusiness/select',
    method: 'get',
    params: {
      storeId
    }
  })
}


export const SaveTime = (row) => {
  return request({
    url: '/api/swap_repair_business/repairbusiness/submit',
    method: 'post',
    data: row
  })
}

export const removeTime = (ids) => {
  return request({
    url: '/api/swap_repair_business/repairbusiness/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}


export const SavePicture = (ids,storeId) => {
  return request({
    url: '/api/swap_repair_picture/repairpicture/SavePicture',
    method: 'post',
    params: {
      ids,
      storeId
    }
  })
}


export const getStorePicture = (storeId) => {
  return request({
    url: '/api/swap_repair_picture/repairpicture/picturelist',
    method: 'get',
    params: {
      storeId
    }
  })
}


export const removePicture = (ids) => {
  return request({
    url: '/api/swap_repair_picture/repairpicture/delete',
    method: 'post',
    params: {
      ids,
    }
  })
}



export const updatePicture = (ids,shopId) => {
  return request({
    url: '/api/swap_repair_picture/repairpicture/updateMain',
    method: 'post',
    params: {
      ids,
      shopId
    }
  })
}

export const updateSort = (row) => {
  return request({
    url: '/api/swap_repair_picture/repairpicture/update',
    method: 'post',
    data: row
  })
}