import React from 'react';
import { reqLabOutPage } from '@/services/LabOutService';
import LabOutComponent
  from '@/pages/lab/[labId]/record/lab-out/components/LabOutComponent';

const LabOut = (props) => {

  return (
    <div>
      <LabOutComponent {...props} reqMethod={reqLabOutPage}/>
    </div>
  );
};

export default LabOut;
