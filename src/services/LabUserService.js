import { doDelete, doGet, doPost, doPut } from '@/utils/request';

const PREFIX = '/lab-user';

export async function reqAddLabUser(labUser) {
  return doPost(PREFIX, { body: labUser });
}

export async function reqAddLabUserByUsername(labUser) {
  return doPost(`${PREFIX}/add-by-username`, { body: labUser });
}

export async function reqApplyJoinLab(labId, applyInfo, baseUserName) {
  return doPost(PREFIX + '/apply-join-lab', { body: { labId, applyInfo, baseUserName } });
}

export async function reqConfirmJoinLab(labId, accept, baseUserId, labUserName, labUserRoleId) {
  return doPost(PREFIX + '/confirm-join-lab', {
    body: { labId, accept, baseUserId, labUserName, labUserRoleId },
  });
}
export async function reqJoinLabByLink(labId, link, labUserName) {
  return doPost(PREFIX + '/join', { body: { labId, link, labUserName } });
}

export async function reqApplyJoinMap(labId) {
  return doGet(PREFIX + '/apply-join-map/' + labId);
}

export async function reqDeleteLabUser(labUserId, labId) {
  return doDelete(`${PREFIX}/${labUserId}?labId=${labId}`);
}

export async function reqUpdateLabUser(labUser) {
  return doPut(`${PREFIX}`, { body: labUser });
}

export async function reqUpdateCurrentLabUser(labUser) {
  return doPut(`${PREFIX}/current`, {body : labUser});
}

export async function reqLabUser(labUserId, labId) {
  return doGet(`${PREFIX}/${labUserId}?labId=${labId}`);
}

export async function reqCurrentLabUser(labId) {
  return doGet(`${PREFIX}/current/lab-id/${labId}`);
}

export async function reqLabUserListByIds(idList, labId) {
  return doGet(`${PREFIX}/ids`, {params: {'ids': idList.join(), labId}});
}

export async function reqLabUserListByLabId(labId) {
  return doGet(`${PREFIX}/lab-id/${labId}`);
}

export async function reqLeaveLab(labId) {
  return doPost(`${PREFIX}/leave/${labId}`);
}
