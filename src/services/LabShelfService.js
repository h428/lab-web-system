import {doDelete, doGet, doPost, doPut} from '@/utils/request';

const PREFIX = '/lab-shelf';

export async function reqCreateLabShelf(labShelf) {
  return doPost(`${PREFIX}`, {body: labShelf});
}

export async function reqCreateMyLabShelf(labShelf) {
  return doPost(`${PREFIX}/my`, {body: labShelf});
}


export async function reqDeleteLabShelf(labShelfId, labId) {
  return doDelete(`${PREFIX}/${labShelfId}?labId=${labId}`);
}

export async function reqUpdateLabShelf(labShelf) {
  return doPut(`${PREFIX}`, {body: labShelf});
}

export async function reqUpdateMyLabShelf(labShelf) {
  return doPut(`${PREFIX}/my`, {body: labShelf});
}

export async function reqLabShelfById(labShelfId, labId) {
  return doGet(`${PREFIX}/${labShelfId}?labId=${labId}`);
}

export async function reqLabShelfListByIds(idList, labId) {
  return doGet(`${PREFIX}/ids`, { params: { 'ids': idList.join(), labId } });
}

export async function reqMyLabShelfListByLabId(labId) {
  return doGet(`${PREFIX}/my/lab-id/${labId}`);
}

export async function reqLabShelfListByLabId(labId) {
  return doGet(`${PREFIX}/lab-id/${labId}`);
}
