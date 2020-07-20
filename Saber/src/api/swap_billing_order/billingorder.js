import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/swap_billing_order/billingorder/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (orderId) => {
  return request({
    url: '/api/swap_billing_order/billingorder/detail',
    method: 'get',
    params: {
      orderId
    }
  })
}


export const billList = (orderId) => {
  return request({
    url: '/api/swap_billing_order/billingorder/billList',
    method: 'get',
    params: {
      orderId
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/swap_billing_order/billingorder/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/swap_billing_order/billingorder/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/swap_billing_order/billingorder/submit',
    method: 'post',
    data: row
  })
}


export const editStatus = (row) => {
  return request({
    url: '/api/swap_billing_order/billingorder/editStatus',
    method: 'post',
    data: row
  })
}





  export const uploadvoucher = (orderId, voucherUrl) => {
    return request({
      url: '/api/swap_billing_order/billingorder/submit',
      method: 'post',
      data: {
        orderId:orderId,
        voucherUrl:voucherUrl,
        orderStatus:'2'
      }
    })
  }
  