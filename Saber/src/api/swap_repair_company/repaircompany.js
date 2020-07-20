import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/swap_repair_company/repaircompany/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (comId) => {
  return request({
    url: '/api/swap_repair_company/repaircompany/detail',
    method: 'get',
    params: {
      comId
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/swap_repair_company/repaircompany/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/swap_repair_company/repaircompany/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/swap_repair_company/repaircompany/submit',
    method: 'post',
    data: row
  })
}

