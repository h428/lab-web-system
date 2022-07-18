/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
// 引入 axios 用于 ajax 请求
import axios from 'axios';
// 引入 ant-d 的组件
import { message } from 'antd';
import StorageUtil from '@/utils/StorageUtil';
import { API_DOMAIN, SYSTEM_PREFIX } from '@/common/Config';
import RouteUtil from '@/utils/RouteUtil';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

axios.defaults.baseURL = API_DOMAIN + SYSTEM_PREFIX;

// 添加请求拦截器设置 token
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么

    const loginResult = StorageUtil.getLoginResult();

    // 添加 loginToken
    if (loginResult && loginResult['token']) {
      config.headers.Authorization = loginResult['token'];
    }

    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  },
);

export { axios };

// 用于避免重复处理 401 导致多次弹出信息以及路径被循环记录
let isProcessingRedirect = false;

/**
 * 结束 401 标记处理，供 login 页面调用；
 * 间 ajax 请求得到 401 后，标记 isProcessingRedirect 为 true 并跳转到 login 页面；
 * 在此期间其他 ajax 请求也返回 401 时会被忽略，以避免重复跳转；
 * 在第一个 ajax 结果成功跳转到 login 页面后调用本方法结束标记，改回 isProcessingRedirect
 */
export const endLoginProcessing = () => {
  isProcessingRedirect = false;
}

/**
 * 能发送 ajax 请求的函数模块，其基于 axios
 * 该函数的返回值是 promise 对象，而 axios.get()/post() 返回的就是 promise 对象
 * 但我们要返回自己创建的 promise 对象，以便能 :
 *      统一处理请求异常
 *      异步返回结果数据 , 而不是包含结果数据的 response
 * @param url 请求地址
 * @param params 请求参数
 * @param body 请求体
 * @param method 请求方法
 * @param full
 * @returns {Promise<unknown>}
 */
const request = (url, { params = {}, body = {}, method = 'GET', full = false } = {}) => {
  return new Promise(function (resolve, reject) {
    let promise; // 自定义的 promise 对象

    // config 对象
    const config = {
      url,
      params, // 路径参数
      data: body, // 请求体，get 方法无效
      method,
    };

    promise = axios.request(config);

    promise
      .then((response) => {
        // response.data 即为 Http 响应体，本项目对应 ResBean 的内容
        const resBean = response.data;
        const { status, message : msg, data} = resBean || {};

        // 处理 200，调用 resolve(resBean) 将数据返回
        if (status < 300) {
          // 对于成功的请求，根据 full 判断：
          // 若是设置了 full，则返回整个 ResBean，外部可能用到整个 ResBean
          // 若是未设置 full，则直接返回 ResBean.data，即取出外面的包裹层直接拿到 data
          resolve(full ? resBean : data);
          return;
        }

        // 处理 401，重定向到登录页
        if (status === 401) {

          // 如果已经有请求处理了 401，则本请求不再继续处理，直接返回
          // 通过该种方式避免一个页面多个 ajax 请求同时返回 401 时多次弹出消息以及多次重定向
          if (isProcessingRedirect) {
            return;
          }

          // 标记进入 401 处理
          isProcessingRedirect = true;

          // doRefresh(response.config, resolve);
          message.error(msg);
          // 移除登录结果
          // StorageUtil.removeLoginResult();

          // 重定向到登录页面，并在成功跳转后再将 isProcessingRedirect 改回 true
          RouteUtil.redirectToLogin();

          return ;
        }

        if (status < 600) {
          message.error(msg);
          // 对于错误请求，则 reject 整个响应体，以在调用处有需要时能够使用 try catch 捕获到响应
          reject(resBean);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const doGet = (url, { params = {}, body = {}, full } = {}) =>
  request(url, { params, body, method: 'GET', full });
export const doPost = (url, { params = {}, body = {}, full } = {}) =>
  request(url, { params, body, method: 'POST', full });
export const doPut = (url, { params = {}, body = {}, full } = {}) =>
  request(url, { params, body, method: 'PUT', full });
export const doDelete = (url, { params = {}, body = {}, full } = {}) =>
  request(url, { params, body, method: 'DELETE', full });

export default request;
