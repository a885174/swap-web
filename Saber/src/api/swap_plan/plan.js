import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/swap_plan/plan/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (planId) => {
  return request({
    url: '/api/swap_plan/plan/detail',
    method: 'get',
    params: {
      planId
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/swap_plan/plan/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const del = (ids,planStatus) => {
  return request({
    url: '/api/swap_plan/plan/del',
    method: 'post',
    params: {
      ids,
      planStatus
    }
  })
}


export const add = (row) => {
  return request({
    url: '/api/swap_plan/plan/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/swap_plan/plan/submit',
    method: 'post',
    data: row
  })
}

