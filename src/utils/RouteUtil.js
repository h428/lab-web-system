import { history } from 'umi';
import { parse, stringify } from 'querystring';
import { endLoginProcessing } from '@/utils/request';
import WebPage from '@/common/WebPage';

const getQueryParamsOfUrl = (urlString) => parse(urlString.split('?')[1]);

export const objectToQuery = (obj) => {
  const q = Object.keys(obj).reduce(function(prev,  cur) {
    const val = obj[cur];
    if (val) {
      prev.push(encodeURIComponent(cur) + "=" + encodeURIComponent(val));
    }
    return prev;
  }, []).join('&');

  if (q === '') {
    return q;
  }

  return '?' + q;

}

/**
 * 基于当前页面重定向到生成 login 页面地址
 * @returns {`/open/login?${string}`}
 */
const getRedirectLoginUrl = () => {
  // 记录当前 tab 的路径以便在登录后重定向回该页面
  const queryString = stringify({
    redirect: window.location.href,
  });
  return `${WebPage.LOGIN}?${queryString}`;
}

/**
 * 请求 400 后重定向到 login 页面
 */
const redirectToLogin = () => {
  // 跳转到登录页，注意 history 是 umi 的 history
  history.push(getRedirectLoginUrl());
  setTimeout(()=> {
    // 异步排队并 1s 后标记处理结束，避免连续请求反复处理
    endLoginProcessing();
  }, 1000);
}

/**
 * 登录后从 login 页面恢复
 */
const recoverFromLogin = () => {

  // 从当前登录地址的查询参数中取出 redirect 查询参数
  const params = getQueryParamsOfUrl(window.location.href);
  let { redirect } = params;

  // 如果没有 redirect 参数，则跳转到后台主页
  if (!redirect) {
    RouteUtil.redirect(WebPage.LAB);
    return;
  }

  // 如果有 redirect 参数，则使用 querystring 解析 redirect 并跳到对应的页面
  // 分别用 login 页面和 redirect 页面构造 URL 对象，以进一步做后续的判断
  const loginUrl = new URL(window.location.href);
  const redirectUrlStr = String(redirect);
  const redirectUrl = new URL(redirectUrlStr);

  // 二者是否同源
  if (loginUrl.origin !== redirectUrl.origin) {
    // 二者不同源，则直接跳转到 redirectUtl
    RouteUtil.redirect(redirectUrl);
    return;
  }

  // 同源，则去掉源，取出后缀，并处理锚点后调转
  let targetUrlStr = redirectUrlStr.substring(loginUrl.origin.length);
  // 处理 hash 路由或者锚点
  if (targetUrlStr.match(/^\/.*#/)) {
    targetUrlStr = targetUrlStr.substring(targetUrlStr.indexOf('#') + 1);
  }
  history.replace(targetUrlStr || '/');
}

function getQuery(props) {
  return props.location.query;
}

function getQueryParam(props, key) {
  return props.location.query[key];
}


function getPathParam(props, key) {
  return props.match.params[key];
}

function getPathname(props) {
  return props.location.pathname;
}

const push = (pathname, query) => {
  history.push({
    pathname,
    query
  });
}

const goBack = () => {
  history.goBack();
}

const redirect = (pathname, query) => {
  history.replace({
    pathname,
    query
  });
}

const RouteUtil = {
  getQueryParamsOfUrl,
  objectToQuery,
  getRedirectLoginUrl,
  redirectToLogin,
  recoverFromLogin,
  getQuery,
  getQueryParam,
  getPathParam,
  getPathname,
  push,
  redirect,
  goBack
};

export default RouteUtil;
