// local 环境，以 mock 为接口，不对接后台
// export const INDEX_DOMAIN = "";
// export const SYSTEM_DOMAIN = '';
// export const API_DOMAIN = '';

// dev 环境，对接本地后台
export const INDEX_DOMAIN = 'http://localhost:80';
export const SYSTEM_DOMAIN = 'http://localhost:8000';
export const API_DOMAIN = 'http://localhost:8080';

// prod 环境，设置真实 ip 或域名
// export const INDEX_DOMAIN = "http://124.221.132.55";
// export const SYSTEM_DOMAIN = 'http://124.221.132.55:81';
// export const API_DOMAIN = 'http://124.221.132.55:8080';

// 后端子系统前缀
export const SYSTEM_PREFIX = '/system';

// 前端各个子模块前缀
export const MODULE_LAB_PREFIX = '/lab';
export const MODULE_GROUP_ORDER_PREFIX = '/group-order';
