
// 将 Mock 的响应结果 json 化，即设置响应头为 json
import ResBeanUtil from './ResBeanUtil';

const respJsonify = (resp) => {
  resp.setHeader('Content-Type', 'application/json; charset=utf-8');
}

// 将 ResBean 对象以 json 的形式写到响应头
const writeObject = (resp, resBean) => {
  respJsonify(resp);
  resp.end(JSON.stringify(resBean));
}

const writeObjectWithResBean = (resp, data) => {
  respJsonify(resp);
  resp.end(JSON.stringify(ResBeanUtil.ok(data)));
}


export default {
  respJsonify,
  writeObject,
  writeObjectWithResBean
}
