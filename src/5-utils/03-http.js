import axios from "axios";
import { Toast } from "antd-mobile";
import { config } from "@utils"
// axios config https://github.com/axios/axios#request-config
// const myApi = 'https://www.easy-mock.com/mock/58fff6e5739ac1685205acb1/data/'
// http://media.duduapp.net/api/
// const pro = process.env.NODE_ENV === "production";
// const test = process.env.NODE_TEST === "test";

// axios.interceptors.response.use((response) => {
//   console.info(response, "rr")
//   return response;
// }, function (error) {
//   console.info(error.response, 'asd')
// });
// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const callApi = (method, data, options = {}) => {
  const opts = { ...options };
  return axios(
    Object.assign(
      {},
      {
        url: config("api"),
        method,
        params: method === "get" ? data : {}, // 添加在请求URL后面的参数
        data: method !== "get" ? data : {}, // 适用于 PUT POST PATCH
        withCredentials: true // 请求时是否携带cookie
      },
      opts
    )
  ).then(data => data.data);
};

const commonCallApi = (method, data, options = {}) => successFn =>
  callApi(method, data, options).then(data => {
    const { errcode, msg } = data
    if (parseInt(errcode, 10) === 0) {
      successFn(data)
    } else if (errcode > 0) {
      Toast.info(msg || "请求出错，请稍后重试！")
    } else {
      console.info(msg)
    }
  }).catch(err => {
    Toast.offline("网络出错，请稍后再试！")
    console.error(err)
  });

export default {
  callApi,
  get: (data = {}) => callApi("get", data),
  getC: (data = {}, successFn) =>
    commonCallApi("get", data)(successFn),

  put: (data = {}) => callApi("put", data),
  putC: (data = {}, successFn) =>
    commonCallApi("put", data)(successFn),

  post: (data = {}) => callApi("post", data),
  postC: (data = {}, successFn) =>
    commonCallApi("post", data)(successFn),

  delete: (data = {}) => callApi("delete", data),
  deleteC: (data = {}, successFn) =>
    commonCallApi("delete", data)(successFn)
};
