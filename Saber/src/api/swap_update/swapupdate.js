import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/swap_update/swapupdate/list',
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
    url: '/api/swap_update/swapupdate/detail',
    method: 'get',
    params: {
      id
    }
  })
}



export const listLog = (current, size, id) => {
  return request({
    url: '/api//swap_update_record/updaterecord/list/'+id,
    method: 'get',
    params: {
      current,
      size,
    }
  })
}

export const getSelect = (current, size, params) => {
  return request({
    url: '/api/swap_update_record/updaterecord/select',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/swap_update/swapupdate/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/swap_update/swapupdate/save',
    method: 'post',
    data: row
  })
}

export const addLog = (row) => {
  return request({
    url: '/api/swap_update_record/updaterecord/save',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/swap_update/swapupdate/submit',
    method: 'post',
    data: row
  })
}



