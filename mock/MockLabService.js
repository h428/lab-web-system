import { API_DOMAIN, SYSTEM_PREFIX } from '../src/common/Config';
import ResBeanUtil from './ResBeanUtil';
import MockUtil from './MockUtil';
import { TOKEN } from './MockOpenService';

// open-service 的统一前缀
const PREFIX = SYSTEM_PREFIX + '/lab';

// umi 定义的 Mock 服务对象
const MockLabService = {};

// key 为对应的 url，value 即为响应体或对应的处理函数
// 若是响应体必须是 object，若是处理函数使用 res.end(body) 设置响应体且必须是 string
MockLabService[`GET ${PREFIX}/own-lab-id-set`] = ResBeanUtil.ok(['1', '2']);

MockLabService[`GET ${PREFIX}/added-in-user-entry-map`] = ResBeanUtil.ok({

});

MockLabService[`GET ${PREFIX}/ids`] = (req, resp) => {

  const idsStr = req.query['ids'][0];

  const idArray = idsStr.split(",");
  const objectArray = [];

  for (let i = 0; i < idArray.length; i++) {
    const id = idArray[i];
    let obj = {
      id: id + '',
      name: 'name' + id,
    };

    if (id === '1') {
      obj = {
        'id': '1',
        'name': '口袋妖怪',
        'type': 0,
        'descInfo': '',
        'belongUserId': '1',
        'createUserId': '1',
        'createTime': '0',
        'updateUserId': '1',
        'updateTime': '0',
        'handOverUserId': '0',
        'handOverTime': '0',
        'status': 0,
        'allowApply': true,
        'deleted': false,
        'deleteTime': '0',
      };
    }

    if (id === '2') {
      obj = {
        'id': '2',
        'name': '英雄联盟',
        'type': 0,
        'descInfo': '',
        'belongUserId': '1',
        'createUserId': '1',
        'createTime': '0',
        'updateUserId': '1',
        'updateTime': '0',
        'handOverUserId': '0',
        'handOverTime': '0',
        'status': 0,
        'allowApply': true,
        'deleted': false,
        'deleteTime': '0',
      };
    }
    objectArray[i] = obj;
  }

  MockUtil.writeObjectWithResBean(resp, objectArray);

}

export default MockLabService;
