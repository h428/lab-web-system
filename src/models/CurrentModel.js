import { reqLab } from '@/services/LabService';
import ModelUtil from '@/models/ModelUtil';
import { reqCurrentBaseUser } from '@/services/BaseUserService';
import { reqCurrentLabUser, reqLabUserListByLabId } from '@/services/LabUserService';
import {
  reqMyLabShelfListByLabId,
  reqLabShelfListByLabId,
} from '@/services/LabShelfService';
import { reqLabRoleListByLabId } from '@/services/LabRoleService';

const CurrentModel = () => {

  const [currentBaseUser, refreshCurrentBaseUser] = ModelUtil.generateData({}, reqCurrentBaseUser);
  const [currentLab, refreshCurrentLab] = ModelUtil.generateData({}, reqLab);
  const [currentLabUser, refreshCurrentLabUser] = ModelUtil.generateData({labRole: {}}, reqCurrentLabUser);
  const [myLabShelfList, refreshMyLabShelfList] = ModelUtil.generateData(null, reqMyLabShelfListByLabId);
  const [currentLabShelfList, refreshCurrentLabShelfList] = ModelUtil.generateData(null, reqLabShelfListByLabId);
  const [currentLabUserList, refreshCurrentLabUserList] = ModelUtil.generateData(null, reqLabUserListByLabId);
  const [currentLabRoleList, refreshCurrentLabRoleList] = ModelUtil.generateData(null, reqLabRoleListByLabId);

  return {
    // 当前登录的 baseUser
    currentBaseUser, refreshCurrentBaseUser,
    // 当前访问的 lab
    currentLab, refreshCurrentLab,
    // baseUser 在当前 lab 对应的实验室用户 labUser
    currentLabUser, refreshCurrentLabUser,
    // 当前 labUser 拥有的架子列表
    myLabShelfList, refreshMyLabShelfList,
    // 当前实验室的所有架子列表
    currentLabShelfList, refreshCurrentLabShelfList,
    // 当前实验室拥有的实验室成员列表
    currentLabUserList, refreshCurrentLabUserList,
    // 当前实验室拥有的角色列表
    currentLabRoleList, refreshCurrentLabRoleList,
  };

};

export default CurrentModel;
