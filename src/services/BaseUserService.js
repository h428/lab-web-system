import { doGet, doPost, doPut } from '@/utils/request';

const PREFIX = '/base-user';

const changeAvatar = (baseUser) => {
  // 统一设置固定 avatar
  if (!baseUser.avatar || !baseUser.avatar.startsWith("http")) {
    // baseUser['avatar'] = 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png';
    baseUser['avatar'] = 'https://joeschmoe.io/api/v1/random';
  }
}

export async function reqCurrentBaseUser() {
  const baseUserPromise = doGet(`${PREFIX}/current`);
  baseUserPromise.then(baseUser => {
    changeAvatar(baseUser);
  })
  return baseUserPromise;
}

export async function reqUpdateBaseUser(baseUser) {
  return doPut(`${PREFIX}`, { body: baseUser });
}

export async function reqUpdateBaseUserPassword(baseUserUpdatePasswordRO) {
  return doPut(`${PREFIX}/update-password`, { body: baseUserUpdatePasswordRO });
}

export async function reqBaseUser(baseUserId) {
  const baseUserPromise = doGet(`${PREFIX}/${baseUserId}`);

  baseUserPromise.then(baseUser => {
    changeAvatar(baseUser);
  })

  return baseUserPromise;
}


export async function reqBaseUserListByIds(idList) {
  return doGet(`${PREFIX}/ids`, { params: { 'ids': idList.join() } });
}

export async function reqLogout() {
  return doPost(`${PREFIX}/logout`);
}
