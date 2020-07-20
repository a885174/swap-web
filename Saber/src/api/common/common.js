import request from '@/router/axios';



export const getPamram = (key) => {
    return request({
      url: '/api//swap_app_versoin/common/getParam',
      method: 'get',
      params: {
        key
      }
    })
  }