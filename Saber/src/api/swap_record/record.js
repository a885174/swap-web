import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/swap_record/record/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (recordId) => {
  return request({
    url: '/api/swap_record/record/detail',
    method: 'get',
    params: {
      recordId
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/swap_record/record/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/swap_record/record/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/swap_record/record/submit',
    method: 'post',
    data: row
  })
}

export const importxls = () => {
  return request({
    url: '/api/swap_record/record/exportExcel',
    method: 'post',
    responseType:'blob'
  })
}

