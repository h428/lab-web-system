import {doDelete, doGet, doPost, doPut} from '@/utils/request';

const PREFIX = '/lab-role';

export async function reqCreateLabRole(labRole) {
  return doPost(`${PREFIX}/`, {body: labRole});
}

export async function reqDeleteLabRole(labRoleId, labId) {
  return doDelete(`${PREFIX}/${labRoleId}?labId=${labId}`);
}

export async function reqUpdateLabRole(labRole) {
  return doPut(`${PREFIX}/`, {body: labRole});
}

export async function reqLabRole(labRoleId) {
  return doGet(`${PREFIX}/${labRoleId}`);
}

export async function reqLabRoleListByIds(idList, labId) {
  return doGet(`${PREFIX}/ids`, { params: { 'ids': idList.join(), labId } });
}

export async function reqLabRoleListByLabId(labId) {
  return doGet(`${PREFIX}/lab-id/${labId}`);
}
