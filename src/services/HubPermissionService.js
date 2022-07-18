import {doGet} from '@/utils/request';

const PREFIX = '/lab-permission';

export async function reqHubPermissionListByRoleId(hubUserRoleId) {
  return doGet(`${PREFIX}/hub-user-role-id/${hubUserRoleId}`);
}

export async function reqCurrentStringPermissionSetByHubId(hubId) {
  return doGet(`${PREFIX}/current/hub-id/${hubId}`);
}
