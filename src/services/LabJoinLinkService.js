import { doDelete, doGet, doPost, doPut } from '@/utils/request';

const PREFIX = '/lab-join-link';

export async function reqAddLabJoinLink(labJoinLink) {
  return doPost(PREFIX, { body: labJoinLink });
}

export async function reqDeleteLabJoinLink(labJoinLinkId, labId) {
  return doDelete(`${PREFIX}/${labJoinLinkId}?labId=${labId}`);
}

export async function reqLabJoinLinkList(labId) {
  return doGet(`${PREFIX}/lab-id/${labId}`);
}

export async function reqLabJoinLinkByLink(link) {
  return doGet(`${PREFIX}/link/${link}`);
}
