import {doDelete, doGet, doPost, doPut} from '@/utils/request';

const PREFIX = '/group-order-message-item';

export async function reqGroupOrderMessageItemListByGroupOrderMessageId(groupOrderMessageId) {
  return doGet(`${PREFIX}/group-order-message-id/${groupOrderMessageId}`);
}

export async function reqReply(replyDto) {
  return doPost(`${PREFIX}/reply`, {body: replyDto});
}

