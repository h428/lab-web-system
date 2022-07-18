import ModelUtil from '@/models/ModelUtil';
import { reqCurrentBaseUser } from '@/services/BaseUserService';

const BaseUserModel = () => {

  const [currentBaseUser, refreshCurrentBaseUser] = ModelUtil.generateData(null, reqCurrentBaseUser);

  return {
    currentBaseUser,
    refreshCurrentBaseUser,
  };

};

export default BaseUserModel;
