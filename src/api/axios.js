import axios from "axios";
// import * as cookie from '@/utils/cookie';

// 记录和显示错误
function errorLog(data, config) {
  // 打印到控制台
  if (process.env.NODE_ENV === "development") {
    console.error("请求接口报错:", config);
  }
}

// const CancelToken = axios.CancelToken;
const api = axios.create({
  baseURL: "/",
  timeout: 30000, // 超时时间
  headers: {
    "Content-Type": "application/json;charset=UTF-8"
  },
  validateStatus: status => status === 200
});

api.interceptors.request.use(
  config => {
    return config;
  },
  error => Promise.resolve(false) // eslint-disable-line
);

api.interceptors.response.use(
  res => {
    return Promise.reject(res && res.data);
  },
  error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = "请求错误";
          break;
        case 401:
          error.message = "未授权，请登录";
          break;
        case 403:
          error.message = "拒绝访问";
          break;
        case 404:
          error.message = `请求地址出错: ${error.response.config.url}`;
          break;
        case 408:
          error.message = "请求超时";
          break;
        case 500:
          error.message = "服务器内部错误";
          break;
        case 501:
          error.message = "服务未实现";
          break;
        case 502:
          error.message = "网关错误";
          break;
        case 503:
          error.message = "服务不可用";
          break;
        case 504:
          error.message = "网关超时";
          break;
        case 505:
          error.message = "HTTP版本不受支持";
          break;
        default:
          break;
      }
      errorLog(error);
    }
    return Promise.reject(error);
  }
);

export default api;