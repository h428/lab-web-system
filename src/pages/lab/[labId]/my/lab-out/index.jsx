import React from 'react';
import {
  reqLabOutPage,
  reqMyLabOutPageByLabId,
} from '@/services/LabOutService';
import LabOutComponent
  from '@/pages/lab/[labId]/record/lab-out/components/LabOutComponent';

const LabOut = (props) => {

  return (
    <div>
      {/*直接使用高度抽象的 LabOut 组件*/}
      <LabOutComponent {...props} reqMethod={reqMyLabOutPageByLabId} myOut={true}/>
    </div>
  );
};

export default LabOut;
