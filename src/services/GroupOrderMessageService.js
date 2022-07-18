import {doDelete, doGet, doPost, doPut} from '@/utils/request';

const PREFIX = '/group-order-message';

export async function reqGroupOrderMessagePageByGroupOrderId(groupOrderId, pageQueryDto) {
  return doGet(`${PREFIX}/page/group-order-id/${groupOrderId}`, {params: pageQueryDto});
}

export async function reqRemark(remarkDto) {
  return doPost(`${PREFIX}/remark`, {body: remarkDto});
}


