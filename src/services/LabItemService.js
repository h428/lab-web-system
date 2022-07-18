import {doDelete, doGet, doPost, doPut} from '@/utils/request';

const PREFIX = '/lab-item';

export async function reqSaveLabItem(labItem) {
  return doPost(`${PREFIX}`, {body: labItem});
}

export async function reqCreateLabItem(labItem) {
  return doPost(`${PREFIX}`, {body: labItem});
}

export async function reqDeleteLabItem(labItemId, labId) {
  return doDelete(`${PREFIX}/${labItemId}?labId=${labId}`);
}

export async function reqUpdateLabItem(labItem) {
  return doPut(`${PREFIX}`, {body: labItem});
}

export async function reqLabItem(labItemId, labId) {
  return doGet(`${PREFIX}/${labItemId}?labId=${labId}`);
}

export async function reqLabItemListByIds(idList, labId) {
  return doGet(`${PREFIX}/ids`, { params: { 'ids': idList.join(), labId } });
}

export async function reqLabItemListByLabId(labId) {
  return doGet(`${PREFIX}/lab-id/${labId}`);
}
