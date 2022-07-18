import {doDelete, doGet, doPost, doPut} from '@/utils/request';

const PREFIX = '/lab-out';

export async function reqLabOut(labOutId) {
  return doGet(`${PREFIX}/${labOutId}`);
}

export async function reqMyLabOutPageByLabId(labId, params) {
  params = Object.assign({ labId }, params)
  return doGet(`${PREFIX}/page/my-lab-out`, {params});
}

export async function reqLabOutPage(labId, params) {
  params = Object.assign({ labId }, params)
  return doGet(`${PREFIX}/page`, {params});
}



