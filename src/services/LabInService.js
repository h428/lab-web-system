import {doDelete, doGet, doPost, doPut} from '@/utils/request';

const PREFIX = '/lab-in';

export async function reqLabIn(labInId) {
  return doGet(`${PREFIX}/${labInId}`);
}

export async function reqLabInListByIds(idList, labId) {
  return doGet(`${PREFIX}/ids`, { params: { 'ids': idList.join(), labId } });
}

export async function reqLabInPageBeanByLabId(labId, params) {
  params = Object.assign({labId}, params)
  return doGet(`${PREFIX}/page`, {params});
}

export async function reqLabInPageBeanByLabItemId(labId, params) {
  return doGet(`${PREFIX}/page/lab-item-id/${labId}`, {params});
}
