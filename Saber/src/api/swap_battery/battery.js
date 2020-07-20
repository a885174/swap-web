import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/swap_battery/battery/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (batteryId) => {
  return request({
    url: '/api/swap_battery/battery/detail',
    method: 'get',
    params: {
      batteryId
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/swap_battery/battery/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/swap_battery/battery/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/swap_battery/battery/submit',
    method: 'post',
    data: row
  })
}


export const importxls = () => {
  return request({
    url: '/api/swap_battery/battery/exportExcel',
    method: 'post',
    responseType:'blob'
  })
}


