import {doDelete, doGet, doPost, doPut} from '@/utils/request';

const PREFIX = 'lab-apply';

export async function reqLabApply(labApplyId) {
  return doGet(`${PREFIX}/${labApplyId}`);
}

export async function reqLabApplyPageByLabId(labId, params) {
  params = Object.assign({labId}, params)
  return doGet(`${PREFIX}/page`, {params});
}

export async function reqLabApplyPageByLabItemId(labItemId, params) {
  return doGet(`${PREFIX}/page/lab-item-id/${labItemId}`, {params});
}

export async function reqLabApplyPageByLabInId(originId, params) {
  return doGet(`${PREFIX}/page/lab-in-id/${originId}`, {params});
}

export async function reqLabApplyPageByOpLabUserId(opLabUserId, params) {
  return doGet(`${PREFIX}/page/op-lab-user-id/${opLabUserId}`, {params});
}

export async function reqMyToBeConfirmPageByLabId(labId, params) {
  return doGet(`${PREFIX}/page/my-to-be-confirm/lab-id/${labId}`, {params});
}

export async function reqMyLendPageByLabId(labId, params) {
  return doGet(`${PREFIX}/page/my-lend/lab-id/${labId}`, {params});
}

export async function reqToBeConfirmPageByLabId(labId, params) {
  return doGet(`${PREFIX}/page/to-be-confirm/lab-id/${labId}`, {params});
}

export async function reqMyLabApplyPageByLabId(labId, params) {
  return doGet(`${PREFIX}/page/my-lab-apply/lab-id/${labId}`, {params});
}





