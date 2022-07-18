import React from 'react';
import { reqMyLabOutPageByLabId } from '@/services/LabOutService';
import LabOutComponent
  from '@/pages/lab/[labId]/record/lab-out/components/LabOutComponent';

const LabOut = (props) => {

  return (
    <div>
      <LabOutComponent {...props} reqMethod={reqMyLabOutPageByLabId} myOut={true}/>
    </div>
  );
};

export default LabOut;
