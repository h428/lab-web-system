
const validate = (authority, antdMenuItem, perms) => {

  // 没有要求权限，直接返回
  if (!authority || authority.length === 0) {
    return antdMenuItem;
  }

  // 若权限列表为空，则无权限
  if (!perms || perms.length === 0) {
    return {};
  }

  // authority 也是一个 array，若权限列表包含其中一个 item，则最终返回 true
  if (authority.some(item => perms.includes(item))) {
    return antdMenuItem;
  }

  return {};
};

const hasPerm = (currentPerms, perm) => {
  if (currentPerms && currentPerms.includes(perm)) {
    return true;
  }
  return false;
}

const existPerm = (currentPerms, perms) => {

  if (!Array.isArray(perms)) {
    console.log("perms 必须为数组，检查参数");
  }

  if (!currentPerms) {
    return false;
  }

  for (const perm of perms) {
    // 包含一个，即 true
    if (currentPerms.includes(perm)) {
      return true;
    }
  }

  // 全都不包含，返回 false
  return false;
}

export default {
  validate,
  hasPerm,
  existPerm
}
