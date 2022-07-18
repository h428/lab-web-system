import { doDelete, doGet, doPost, doPut } from '@/utils/request';

const PREFIX = '/op';

export async function reqIn(inDTO) {
  return doPost(`${PREFIX}/in`, {body: inDTO});
}

export async function reqApply(applyDTO) {
  return doPost(`${PREFIX}/apply`, {body: applyDTO});
}

export async function reqApplyFull(applyDTO) {
  return doPost(`${PREFIX}/apply`, {body: applyDTO, full: true});
}

export async function reqMove(modeDTO) {
  return doPost(`${PREFIX}/move`, {body: modeDTO});
}

export async function reqConfirm(labApplyId, accept, labId) {
  const body = { labApplyId, accept, labId};
  return doPost(`${PREFIX}/confirm`, {body});
}

export async function reqOut(opOutDTO) {
  return doPost(`${PREFIX}/out/`, {body: opOutDTO});
}
