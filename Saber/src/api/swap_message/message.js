import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/swap_message/message/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (messageId) => {
  return request({
    url: '/api/swap_message/message/detail',
    method: 'get',
    params: {
      messageId
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/swap_message/message/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/swap_message/message/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/swap_message/message/submit',
    method: 'post',
    data: row
  })
}

