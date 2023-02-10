// 对axios进行封装
// 为了让接口在请求前后进行处理

import axios from "axios";
import config from "../config/index.js";
import { ElMessage } from "element-plus";

const NETWORK_ERROR = "网络请求错误 #114514";

//创建一个axios实例
const service = axios.create({
  baseURL: config.baseApi,
});

//添加拦截器：请求前做
service.interceptors.request.use((req) => {
  // console.log("123");
  return req;
});

//添加拦截器：响应后做
service.interceptors.response.use((res) => {
  /* 
  res.data:{
  code: 200
  data: {tableData: Array(6)}
  [[Prototype]]: Object
  } 
*/
  const { code, data, msg } = res.data;

  // console.log(res);

  if (code == 200) {
    return data;
  } else {
    //请求错误
    // element组件 页面上方提示
    // FIXME: 不提示 奇了怪了
    // console.log("object");
    // ElMessage.error("msg || NETWORK_ERROR");
    // ElMessage({
    //   message: "this is a message ",
    //   type: "warning",
    //   duration: 0,
    // });

    ElMessage.error(msg || NETWORK_ERROR);

    return Promise.reject(msg || NETWORK_ERROR);
  }
});

//核心函数
function request(options) {
  options.method = options.method || "get";

  if (options.method.toLowerCase() == "get") {
    options.params = options.data;
  }

  //mock的处理
  let isMock = config.mock;
  if (typeof options.mock !== "undefined") {
    isMock = options.mock;
  }

  //对线上环境处理
  if (config.env == "prod") {
    //不给使用mock的机会
    service.defaults.baseURL = config.baseApi;
  } else {
    service.defaults.baseURL = isMock
      ? config.mockApi
      : config.baseApi;
  }
  // console.log(options);
  return service(options);
}

export default request;
