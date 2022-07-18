import {doDelete, doGet, doPost, doPut} from '@/utils/request';

const PREFIX = '/group-order-item';

export async function reqJoinGroupOrder(groupOrderItemJoinVo) {
  return doPost(`${PREFIX}/join`, {body: groupOrderItemJoinVo});
}

export async function reqUpdateGroupOrderItem(id, groupOrderItemUpdateDto) {
  return doPut(`${PREFIX}/${id}`, {body: groupOrderItemUpdateDto});
}

export async function reqCancelGroupOrderItem(id) {
  return doPost(`${PREFIX}/cancel/${id}`);
}

export async function reqConfirmGroupOrderItem(id) {
  return doPost(`${PREFIX}/confirm/${id}`);
}

export async function reqRejectGroupOrderItem(id) {
  return doPost(`${PREFIX}/reject/${id}`);
}

export async function reqGroupOrderItemListByGroupOrderId(groupOrderId) {
  return doGet(`${PREFIX}/group-order-id/${groupOrderId}`);
}

export async function reqMyGroupOrderItemPage(pageQueryDto) {
  return doGet(`${PREFIX}/my/page`, {params: pageQueryDto});
}

