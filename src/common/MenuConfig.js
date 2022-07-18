import AntdIcon from '@/components/base/AntdIcon';
import WebPage from '@/common/WebPage';

const getMenuList = (labId) => {

  return [
    {
      path: `${WebPage.getLabPrefix(labId)}`,
      redirect: `${WebPage.getWelcome(labId)}`,
    },
    {
      path: `${WebPage.getWelcome(labId)}`,
      name: `欢迎页`,
      icon: AntdIcon.SMILE
    },
    {
      path: `${WebPage.getLabInventory(labId)}`,
      name: `库存`,
      icon: AntdIcon.DOUBLE_RIGHT,
      authority: [ADDED_IN],
    },
    {
      path: `${WebPage.getLabPrefix(labId)}/my`,
      name: `个人`,
      icon: AntdIcon.UNORDERED_LIST,
      authority: [ADDED_IN],
      children: [
        {
          path: `${WebPage.getMyLabInventory(labId)}`,
          name: `库存`,
          icon: AntdIcon.DOUBLE_RIGHT,
          authority: [ADDED_IN],
        },
        {
          path: `${WebPage.getMyLabShelf(labId)}`,
          name: `架子`,
          icon: AntdIcon.DOUBLE_RIGHT,
          authority: [ADDED_IN],
        },
        {
          path: `${WebPage.getMyConfirmApply(labId)}`,
          name: `审批`,
          icon: AntdIcon.DOUBLE_RIGHT,
          authority: [ADDED_IN],
        },
        {
          path: `${WebPage.getMyLabApply(labId)}`,
          name: `申请记录`,
          icon: AntdIcon.DOUBLE_RIGHT,
          authority: [ADDED_IN],
        },
        {
          path: `${WebPage.getMyLabOut(labId)}`,
          name: `消耗记录`,
          icon: AntdIcon.DOUBLE_RIGHT,
          authority: [ADDED_IN],
        },
      ],
    },
    {
      path: `${WebPage.getLabPrefix(labId)}/lab`,
      name: `实验室`,
      icon: AntdIcon.UNORDERED_LIST,
      authority: [PERM_LAB, PERM_OP_IN],
      children: [
        {
          path: `${WebPage.getLabItem(labId)}`,
          name: `入库`,
          icon: AntdIcon.DOUBLE_RIGHT,
          authority: [PERM_LAB_ITEM, PERM_OP_IN],
        },
        {
          path: `${WebPage.getLabShelf(labId)}`,
          name: `架子`,
          icon: AntdIcon.DOUBLE_RIGHT,
          authority: [PERM_LAB_SHELF],
        },
        {
          path: `${WebPage.getLabConfirmApply(labId)}`,
          name: `审批`,
          icon: AntdIcon.DOUBLE_RIGHT,
          authority: [PERM_OP_CONFIRM_COMMON_APPLY],
        },
      ],
    },
    {
      path: `${WebPage.getLabPrefix(labId)}/perm`,
      name: `用户和权限`,
      icon: AntdIcon.UNORDERED_LIST,
      authority: [OWN, PERM_PERM],
      children: [
        {
          path: `${WebPage.getPermRole(labId)}`,
          name: `角色`,
          icon: AntdIcon.DOUBLE_RIGHT,
          authority: [OWN, PERM_PERM_ROLE],
        },
        {
          path: `${WebPage.getPermUser(labId)}`,
          name: `用户`,
          icon: AntdIcon.DOUBLE_RIGHT,
          authority: [OWN, PERM_PERM_USER],
        },
        {
          path: `${WebPage.getPermLink(labId)}`,
          name: `链接`,
          icon: AntdIcon.DOUBLE_RIGHT,
          authority: [OWN, PERM_PERM_USER],
        },
      ],
    },
    {
      path: `${WebPage.getLabPrefix(labId)}/record`,
      name: `记录单`,
      icon: AntdIcon.UNORDERED_LIST,
      authority: [OWN, PERM_RECORD],
      children: [
        {
          path: `${WebPage.getRecordLabIn(labId)}`,
          name: `入库记录`,
          icon: AntdIcon.DOUBLE_RIGHT,
          authority: [OWN, PERM_RECORD_IN],
        },
        {
          path: `${WebPage.getRecordLabOut(labId)}`,
          name: `消耗记录`,
          icon: AntdIcon.DOUBLE_RIGHT,
          authority: [OWN, PERM_RECORD_OUT],
        },
        {
          path: `${WebPage.getRecordLabApply(labId)}`,
          name: `申请归还记录`,
          icon: AntdIcon.DOUBLE_RIGHT,
          authority: [OWN, PERM_RECORD_APPLY],
        },
        // {
        //   path: `${LAB_PREFIX}/${labId}/record/buy-apply`,
        //   name: `购买申请记录`,
        //   icon: AntdIcon.DOUBLE_RIGHT,
        //   authority: ['own', 'record:buy-apply'],
        // },
      ],
    },
  ];
};



export const ADDED_IN = 'added-in';
export const OWN = 'own';
export const PERM_LAB = 'lab';
export const PERM_PERM = 'perm';
export const PERM_RECORD = 'record';
export const PERM_OP = 'op:in';
export const PERM_OP_IN = 'op:in';
export const PERM_OP_CONFIRM_COMMON_APPLY = 'op:confirm-common-apply';
export const PERM_OP_CONFIRM_BUY_APPLY = 'op:confirm-buy-apply';
export const PERM_OP_MOVE = 'op:move';
export const PERM_LAB_ITEM = 'lab:item';
export const PERM_LAB_SHELF = 'lab:shelf';
export const PERM_PERM_USER = 'perm:user';
export const PERM_PERM_ROLE = 'perm:role';
export const PERM_RECORD_IN = 'record:in';
export const PERM_RECORD_OUT = 'record:out';
export const PERM_RECORD_APPLY = 'record:apply';
export const PERM_RECORD_BUY_APPLY = 'record:buy-apply';

// 权限信息：tag -> id
export const LAB_PERMISSION_MAP = {
  [PERM_OP]: '101',
  [PERM_LAB]: '102',
  [PERM_PERM]: '103',
  [PERM_RECORD]: '104',
  [PERM_OP_IN]: '10101',
  [PERM_OP_CONFIRM_COMMON_APPLY]: '10102',
  [PERM_OP_CONFIRM_BUY_APPLY]: '10103',
  [PERM_OP_MOVE]: '10104',
  [PERM_LAB_ITEM]: '10201',
  [PERM_LAB_SHELF]: '10202',
  [PERM_PERM_USER]: '10301',
  [PERM_PERM_ROLE]: '10302',
  [PERM_RECORD_IN]: '10401',
  [PERM_RECORD_OUT]: '10402',
  [PERM_RECORD_APPLY]: '10403',
  [PERM_RECORD_BUY_APPLY]: '10404',
};

export default {
  getMenuList
}

