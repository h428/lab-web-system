import {doDelete, doGet, doPost, doPut} from '@/utils/request';

const PREFIX = '/lab-inventory';

// params 包括分页参数和查询参数
// 分页参数：pageNum, pageSize，默认值分别为 1，10
// 查询参数，按优先级分别为：labId, labShelfId, labItemId, labUserId, search，若都不提供则根据 lab 查询
// 其中 labId 必须提供
export async function reqLabInventoryPage(params) {
  return doGet(`${PREFIX}/page`, {params});
}


