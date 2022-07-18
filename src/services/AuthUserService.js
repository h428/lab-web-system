import { doGet, doPost, doPut } from '@/utils/request';

const PREFIX = '/auth-user';

export async function reqAuthUserById(authUserId) {
  return doGet(`${PREFIX}/${authUserId}`, );
}

export async function reqMyAuthUser() {
  return doGet(`${PREFIX}/my-auth-user`, );
}

export async function reqAddAuthUser(authUser) {
  return doPost(`${PREFIX}`, {body: authUser});
}

export async function reqUpdateAuthUserById(id, authUser) {
  return doPut(`${PREFIX}/${id}`, {body: authUser});
}
