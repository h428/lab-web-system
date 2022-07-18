import React, { useEffect, useState } from 'react';
import LabApplyDataTable
  from '@/pages/lab/[labId]/record/lab-apply/components/LabApplyDataTable';
import RouteUtil from '@/utils/RouteUtil';
import { reqToBeConfirmPageByLabId } from '@/services/LabApplyService';

const ConfirmApply = (props) => {

  const labId = RouteUtil.getPathParam(props, 'labId');
  const page = RouteUtil.getQueryParam(props, 'page');

  const [reload, setReload] = useState(0);

  const [labApplyPageBean, setLabApplyPageBean] = useState({})



  useEffect(async () => {
    // 请求数据
    const pageBean = await reqToBeConfirmPageByLabId(labId, { page });
    setLabApplyPageBean(pageBean);
  }, [reload, page]);

  return (
    <div>
      <LabApplyDataTable title={(<h2>待审批申请列表</h2>)}
                         showOp={true}
                         labId={labId} setReload={setReload}
                         labApplyPageBean={labApplyPageBean}
      />
    </div>
  );
};

export default ConfirmApply;
