import {doDelete, doGet, doPost, doPut} from '@/utils/request';

const PREFIX = '/group-order';

export async function reqAddGroupOrder(groupOrderDto) {
  return doPost(`${PREFIX}`, {body: groupOrderDto});
}

export async function reqCancelGroupOrder(id) {
  return doPost(`${PREFIX}/cancel/${id}`);
}

export async function reqConfirmGroupOrder(id) {
  return doPost(`${PREFIX}/confirm/${id}`);
}

export async function reqUpdateGroupOrder(id, groupOrderDto) {
  return doPut(`${PREFIX}/${id}`, {body: groupOrderDto});
}

export async function reqGroupOrderPage(queryDto) {
  return doGet(`${PREFIX}/page`, {params: queryDto});
}

export async function reqGroupOrderById(id) {
  return doGet(`${PREFIX}/${id}`);
}

