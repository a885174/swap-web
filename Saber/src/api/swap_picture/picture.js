import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/swap_picture/picture/list',
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
    url: '/api/swap_picture/picture/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/swap_picture/picture/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/swap_picture/picture/save',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/swap_picture/picture/submit',
    method: 'post',
    data: row
  })
}


export const getPicture = () => {
  return request({
    url: '/api/swap_picture/picture/picturelist',
    method: 'get'
  })
}



export const addPic = (pictureMainUrl) => {
  return request({
    url: '/api/swap_picture/picture/save',
    method: 'post',
    data: {
      pictureMainUrl:pictureMainUrl
    }
  })
}