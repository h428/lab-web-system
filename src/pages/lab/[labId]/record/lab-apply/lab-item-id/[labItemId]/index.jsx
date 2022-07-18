import React from 'react';
import { reqLabApplyPageByLabId } from '@/services/LabApplyService';
import LabApplyComponent
  from '@/pages/lab/[labId]/record/lab-apply/components/LabApplyComponent';

const LabApply = (props) => {


  return (
    <div>
      <LabApplyComponent {...props} reqMethod={reqLabApplyPageByLabId} />
    </div>
  );
};

export default LabApply;
