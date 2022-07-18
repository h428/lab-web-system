import { API_DOMAIN, SYSTEM_PREFIX } from '../src/common/Config';
import ResBeanUtil from './ResBeanUtil';
import MockUtil from './MockUtil';

// open-service 的统一前缀
const PREFIX = SYSTEM_PREFIX + '/open';

export const TOKEN = "123456789";

// umi 定义的 Mock 服务对象
const MockOpenService = {};

// key 为对应的 url，value 即为响应体或对应的处理函数
// 若是响应体必须是 object，若是处理函数使用 res.end(body) 设置响应体且必须是 string
MockOpenService[`POST ${PREFIX}/test/*`] = (req, resp) => {
  // 添加跨域请求头
  resp.setHeader('Access-Control-Allow-Origin', '*');
  // 设置响应类型为 json
  MockUtil.respJsonify(resp);
  resp.end(JSON.stringify(ResBeanUtil.ok(Math.random())));
};

// 方式一：直接返回一个对象，其 json 作为响应体，http 状态码为 200
// 只要成功过了前端校验就统一注册成功
MockOpenService[`POST ${PREFIX}/register`] = ResBeanUtil.ok(true);


MockOpenService[`POST ${PREFIX}/login`] = (req, resp) => {
  MockUtil.respJsonify(resp);

  // 邮箱包含 lyh 且密码包含 lyh 即登录成功
  if (req.body.email.indexOf('lyh') !== -1 && req.body.password.indexOf('lyh') !== -1) {
    resp.end(
      JSON.stringify(
        ResBeanUtil.ok({ token: TOKEN })
      )
    );
  } else {
    // 其他情况登录失败
    resp.end(
      JSON.stringify(
        ResBeanUtil.badRequest('密码错误')
      )
    );
  }
}

// 方式二：返回一个函数，其入参为 req 和 resp，可以模拟后端逻辑，使用 resp.end 写入响应体，必须是 string
MockOpenService[`GET ${PREFIX}/check/email-exist/*`] = (req, resp) => {

  const url = req.originalUrl;
  MockUtil.respJsonify(resp);

  // email 包含 lyh 的邮箱表示已经被注册，data 返回 true 表示已经存在对应记录
  if (url.indexOf('lyh') !== -1) {
    // false 表示名称未被占用，可以使用
    resp.end(JSON.stringify(ResBeanUtil.ok(true)));
    return;
  }

  // 其他邮箱都可以用，data 返回 false 表示不存在对应记录
  return resp.end(JSON.stringify(ResBeanUtil.ok(false)));
};

MockOpenService[`GET ${PREFIX}/check/username-exist/*`] = (req, resp) => {

  const url = req.originalUrl;
  MockUtil.respJsonify(resp);

  // 用户名包含 lyh 的用户名都被占用
  if (url.indexOf('lyh') !== -1) {
    // true 表示存在对应名称的记录，名称不可用
    resp.end(JSON.stringify(ResBeanUtil.ok(true)));
    return;
  }

  // 其他用户名都未被占用，可用
  return resp.end(JSON.stringify(ResBeanUtil.ok(false)));
};

export default MockOpenService;
