import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/swap_store/store/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (storeId) => {
  return request({
    url: '/api/swap_store/store/detail',
    method: 'get',
    params: {
      storeId
    }
  })
}

export const SaveTime = (row) => {
  return request({
    url: '/api/swap_business_hours/businesshours/submit',
    method: 'post',
    data: row
  })
}

export const removeTime = (ids) => {
  return request({
    url: '/api/swap_business_hours/businesshours/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const SavePicture = (ids,storeId) => {
  return request({
    url: '/api/swap_store_picture/storepicture/SavePicture',
    method: 'post',
    params: {
      ids,
      storeId
    }
  })
}

export const removePicture = (ids) => {
  return request({
    url: '/api/swap_store_picture/storepicture/delete',
    method: 'post',
    params: {
      ids,
    }
  })
}


export const updatePicture = (ids,storeId) => {
  return request({
    url: '/api/swap_store_picture/storepicture/updateMain',
    method: 'post',
    params: {
      ids,
      storeId
    }
  })
}

export const updateSort = (row) => {
  return request({
    url: '/api/swap_store_picture/storepicture/update',
    method: 'post',
    data: row
  })
}

export const getStorePicture = (storeId) => {
  return request({
    url: '/api/swap_store_picture/storepicture/picturelist',
    method: 'get',
    params: {
      storeId
    }
  })
}

export const addPhoto = (pictureUrl,storeId) => {
  return request({
    url: '/api/swap_store_picture/storepicture/saveShopPicture',
    method: 'post',
    params: {
      pictureUrl,
      storeId
    }
  })
}



export const remove = (ids) => {
  return request({
    url: '/api/swap_store/store/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}


export const add = (row) => {
  return request({
    url: '/api/swap_store/store/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/swap_store/store/submit',
    method: 'post',
    data: row
  })
}


export const updateAddress = (row) => {
  return request({
    url: '/api/swap_store/store/update',
    method: 'post',
    data: row
  })
}

export const del = (ids,storeStatus) => {
  return request({
    url: '/api/swap_store/store/del',
    method: 'post',
    params:{
      ids,
      storeStatus
    }    
  })
}


export const Savemerchant = (ids,merchantId) => {
  return request({
    url: '/api/swap_store/store/Savemerchant',
    method: 'post',
    params: {
      ids,
      merchantId
    }
  })
}



export const delemerch = (ids) => {
  return request({
    url: '/api/swap_store/store/delmerchant',
    method: 'post',
    params: {
      ids,
    }
  })
}


