// sessionStorage 和 localStorage 的工具类

const setSession = (key, obj) => sessionStorage.setItem(key, JSON.stringify(obj));
const getSession = (key) => JSON.parse(sessionStorage.getItem(key));

const existLocal = (key) => localStorage.getItem(key) !== null;
const setLocal = (key, obj) => localStorage.setItem(key, JSON.stringify(obj));
const getLocal = (key) => JSON.parse(localStorage.getItem(key));

// 记住密码时保存的登录信息
const loginInfoKey = 'loginInfo';
const getLoginInfo = () => getLocal(loginInfoKey);
const setLoginInfo = (obj) => setLocal(loginInfoKey, obj);
const existLoginInfo = (obj) => existLocal(loginInfoKey);
const removeLoginInfo = () => localStorage.removeItem(loginInfoKey);

// 用户登录后保存的信息
const loginResultKey = 'loginResult';
const getLoginResult = () => getLocal(loginResultKey);
const setLoginResult = (data) => setLocal(loginResultKey, data);
const removeLoginResult = () => localStorage.removeItem(loginResultKey);

const StorageUtil = {
  setSession,
  getSession,
  setLocal,
  getLocal,
  existLocal,
  getLoginInfo,
  setLoginInfo,
  existLoginInfo,
  removeLoginInfo,
  setLoginResult,
  getLoginResult,
  removeLoginResult,
};

export default StorageUtil;
