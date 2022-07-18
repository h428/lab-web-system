import {doDelete, doGet, doPost, doPut} from '@/utils/request';

const PREFIX = '/lab';

export async function reqCreateLab(lab) {
  return doPost(`${PREFIX}`, {body: lab});
}

export async function reqDeleteLab(labId) {
  return doDelete(`${PREFIX}/${labId}`);
}

export async function reqUpdateLab(lab) {
  // 注意，由于鉴权需要，需要传入的字段名为 labId 而不是 id
  lab.labId = lab.id;
  delete lab.id;
  return doPut(`${PREFIX}`, {body: lab});
}

// 根据 id 查询 lab
export async function reqLab(labId) {
  return doGet(`${PREFIX}/${labId}`);
}

export async function reqLabListByIds(labIdList) {
  return doGet(`${PREFIX}/ids`, {params: {'ids': labIdList.join()}});
}

export async function reqOwnLabEntryMap() {
  return doGet(`${PREFIX}/own-lab-entry-map`);
}

// 被添加到的实验室列表
export async function reqAddedInLabEntryMap() {
  return doGet(`${PREFIX}/added-in-lab-entry-map`);
}
