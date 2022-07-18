import React, { useEffect, useState } from 'react';
import LabApplyDataTable
  from '@/pages/lab/[labId]/record/lab-apply/components/LabApplyDataTable';
import RouteUtil from '@/utils/RouteUtil';
import { reqMyToBeConfirmPageByLabId } from '@/services/LabApplyService';

const ConfirmApply = (props) => {

  const labId = RouteUtil.getPathParam(props, 'labId');
  const page = RouteUtil.getQueryParam(props, 'page');
  const search = RouteUtil.getQueryParam(props, 'search');
  const pathname = RouteUtil.getPathname(props);

  const [reload, setReload] = useState(0);

  const [labApplyPageBean, setLabApplyPageBean] = useState({})

  useEffect(async () => {
    // 请求数据
    const pageBean = await reqMyToBeConfirmPageByLabId(labId, { page });
    setLabApplyPageBean(pageBean);
  }, [reload, page, search]);

  return (
    <div>
      <LabApplyDataTable title={(<h2>待审批申请列表</h2>)}
                         showOp={true} myApply={true}
                         labId={labId} pathname={pathname}
                         setReload={setReload}
                         labApplyPageBean={labApplyPageBean}
      />
    </div>
  );
};

export default ConfirmApply;
