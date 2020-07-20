import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/swap_repair_shop/repairshop/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (shopId) => {
  return request({
    url: '/api/swap_repair_shop/repairshop/detail',
    method: 'get',
    params: {
      shopId
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/swap_repair_shop/repairshop/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/swap_repair_shop/repairshop/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/swap_repair_shop/repairshop/submit',
    method: 'post',
    data: row
  })
}

export const updateAddress = (row) => {
  return request({
    url: '/api/swap_repair_shop/repairshop/update',
    method: 'post',
    data: row
  })
}

export const del = (ids,shopStatus) => {
  return request({
    url: '/api/swap_repair_shop/repairshop/del',
    method: 'post',
    params: {
      ids,
      shopStatus
    }
  })
}

export const addPhoto = (pictureUrl,stroeId) => {
  return request({
    url: '/api/swap_repair_picture/repairpicture/saveShopPicture',
    method: 'post',
    params: {
      pictureUrl,
      stroeId
    }
  })
}