

const ok = (data) => ({
  status: 200,
  message: '请求成功',
  data
});

// js 默认不支持重载只能再起个名字
const okWithMessage = (message, data) => ({
  status: 200,
  message: message,
  data
});

const badRequest = (message, data) => ({
  status: 400,
  message,
  data
});

const unauthorized = (message, data) => ({
  status: 401,
  message,
  data
});

/**
 * 模拟后端 ResBean 对象，以便在 Mock 接口中快速返回 ResBean 对象
 */
export default {
  ok,
  okWithMessage,
  badRequest,
  unauthorized
}
