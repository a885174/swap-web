import request from "@/router/axios";

export const getList = (current, size, params) => {
  return request({
    url: "/api/swap_station/station/page",
    method: "get",
    params: {
      ...params,
      current,
      size
    }
  });
};

export const getDetail = stationId => {
  return request({
    url: "/api/swap_station/station/detail",
    method: "get",
    params: {
      stationId
    }
  });
};

export const getChaList = stationcode => {
  return request({
    url: "/api/swap_station/station/getChaList",
    method: "get",
    params: {
      stationcode
    }
  });
};

export const remove = ids => {
  return request({
    url: "/api/swap_station/station/remove",
    method: "post",
    params: {
      ids
    }
  });
};

export const add = row => {
  return request({
    url: "/api/swap_station/station/submit",
    method: "post",
    data: row
  });
};

export const update = row => {
  return request({
    url: "/api/swap_station/station/submit",
    method: "post",
    data: row
  });
};

export const updateAddress = row => {
  return request({
    url: "/api/swap_station/station/update",
    method: "post",
    data: row
  });
};

export const importxls = () => {
  return request({
    url: "/api/swap_station/station/exportExcel",
    method: "post",
    responseType: "blob"
  });
};

export const SaveStore = (ids, storeId) => {
  return request({
    url: "/api/swap_station/station/SaveStore",
    method: "post",
    params: {
      ids,
      storeId
    }
  });
};

export const del = ids => {
  return request({
    url: "/api/swap_station/station/delStore",
    method: "post",
    params: {
      ids
    }
  });
};

export const SavePicture = (ids, stationId) => {
  return request({
    url: "/api//swap_station_picture/stationpicture/SavePicture",
    method: "post",
    params: {
      ids,
      stationId
    }
  });
};

export const removePicture = ids => {
  return request({
    url: "/api/swap_station_picture/stationpicture/delete",
    method: "post",
    params: {
      ids
    }
  });
};

export const updatePicture = (ids, stationId) => {
  return request({
    url: "/api/swap_station_picture/stationpicture/updateMain",
    method: "post",
    params: {
      ids,
      stationId
    }
  });
};

export const updateSort = row => {
  return request({
    url: "/api/swap_station_picture/stationpicture/update",
    method: "post",
    data: row
  });
};

export const getStationcPicture = stationId => {
  return request({
    url: "/api/swap_station_picture/stationpicture/picturelist",
    method: "get",
    params: {
      stationId
    }
  });
};

export const addPhoto = (pictureUrl, stationId) => {
  return request({
    url: "/api/swap_station_picture/stationpicture/saveStationPicture",
    method: "post",
    params: {
      pictureUrl,
      stationId
    }
  });
};

export const upload = file => {
  return request({
    url: "/api/blade-resource/oss/endpoint//upload",
    method: "post",
    headers: {'Content-Type':'multipart/form-data'},
    data: file
    
  });

};
