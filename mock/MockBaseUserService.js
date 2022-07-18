import { API_DOMAIN, SYSTEM_PREFIX } from '../src/common/Config';
import ResBeanUtil from './ResBeanUtil';
import MockUtil from './MockUtil';
import { TOKEN } from './MockOpenService';

// open-service 的统一前缀
const PREFIX = SYSTEM_PREFIX + '/base-user';

// umi 定义的 Mock 服务对象
const MockBaseUserService = {};

// key 为对应的 url，value 即为响应体或对应的处理函数
// 若是响应体必须是 object，若是处理函数使用 res.end(body) 设置响应体且必须是 string
MockBaseUserService[`GET ${PREFIX}/current`] = (req, resp) => {

  const body = req.body;

  // 设置响应类型为 json
  MockUtil.respJsonify(resp);

  const lyh = {
    'id': '1',
    'email': 'lyh@lab.com',
    'username': 'lyh',
    'name': '',
    'phone': '',
    'wechatNo': '',
    'avatar': '',
    'createTime': '0',
    'lastLoginTime': '0',
    'status': 0,
    'allowAdd': true,
  };

  // authorization 请求头携带了 token
  if (req.headers && req.headers.authorization === TOKEN) {
    MockUtil.writeObject(resp, ResBeanUtil.ok(lyh));
    return;
  }

  // 否则模拟 token 失效，返回 401
  MockUtil.writeObject(resp, ResBeanUtil.unauthorized('未登录'));

};

export default MockBaseUserService;
