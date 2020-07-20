import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/swap_suggest/suggest/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (suggestId) => {
  return request({
    url: '/api/swap_suggest/suggest/detail',
    method: 'get',
    params: {
      suggestId
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/swap_suggest/suggest/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/swap_suggest/suggest/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/swap_suggest/suggest/submit',
    method: 'post',
    data: row
  })
}



export const delwith = (suggestId,content) => {
  return request({
    url: '/api/swap_suggest/suggest/submit',
    method: 'post',
    data: {
      suggestId:suggestId,
      result:content,
      suggestStatus:'1'
    }
  })
}
