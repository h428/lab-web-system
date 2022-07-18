import { MODULE_LAB_PREFIX } from '@/common/Config';

const LOGIN = '/open/login';

const REGISTER = '/open/register';

const RESET_PASSWORD = '/open/reset-password';

const LAB = '/lab';

const getLabPrefix = labId => `${MODULE_LAB_PREFIX}/${labId}`;

// lab 欢迎页
const getWelcome = (labId) => getLabPrefix(labId) + "/welcome";

// 库存页面
const getLabInventory = (labId) => getLabPrefix(labId) + "/lab-inventory";

// 个人菜单页面
const getMyLabInventory = (labId) => getLabPrefix(labId) + "/my/lab-inventory";
const getMyLabShelf = (labId) => getLabPrefix(labId) + "/my/lab-shelf";
const getMyConfirmApply = (labId) => getLabPrefix(labId) + "/my/confirm-apply";
const getMyLabApply = (labId) => getLabPrefix(labId) + "/my/lab-apply";
const getMyLabOut = (labId) => getLabPrefix(labId) + "/my/lab-out";

// 实验室菜单页面
const getLabItem = (labId) => getLabPrefix(labId) + "/lab/item";
const getLabShelf = (labId) => getLabPrefix(labId) + "/lab/shelf";
const getLabConfirmApply = (labId) => getLabPrefix(labId) + "/lab/confirm-apply";


// 权限菜单页面
const getPermRole = (labId) => getLabPrefix(labId) + "/perm/role";
const getPermUser = (labId) => getLabPrefix(labId) + "/perm/user";
const getPermLink = (labId) => getLabPrefix(labId) + "/perm/link";

// 记录单菜单页面
const getRecordLabIn = (labId) => getLabPrefix(labId) + "/record/lab-in";
const getRecordLabOut = (labId) => getLabPrefix(labId) + "/record/lab-out";
const getRecordLabApply = (labId) => getLabPrefix(labId) + "/record/lab-apply";

const WebPage = {
  LOGIN,
  REGISTER,
  RESET_PASSWORD,
  LAB,
  getLabPrefix,
  getWelcome,
  getLabInventory,
  getMyLabInventory,
  getMyLabShelf,
  getMyConfirmApply,
  getMyLabApply,
  getMyLabOut,
  getLabItem,
  getLabShelf,
  getLabConfirmApply,
  getPermRole,
  getPermUser,
  getPermLink,
  getRecordLabIn,
  getRecordLabOut,
  getRecordLabApply,
}

export default WebPage;
