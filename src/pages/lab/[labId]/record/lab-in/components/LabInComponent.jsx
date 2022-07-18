import RouteUtil from '@/utils/RouteUtil';
import React, { useEffect, useState } from 'react';
import { reqLabInPageBeanByLabId } from '@/services/LabInService';
import LabInDataTable
  from '@/pages/lab/[labId]/record/lab-in/components/LabInDataTable';
import DateUtil from '@/utils/DateUtil';

const LabInComponent = (props) => {

  const labId = RouteUtil.getPathParam(props, 'labId');
  const labItemId = RouteUtil.getPathParam(props, 'labItemId');
  const page = RouteUtil.getQueryParam(props, 'page');
  const pathname = RouteUtil.getPathname(props);

  const [startTime, setStartTime] = useState(DateUtil.getFirstDayOfLastMonth());
  const [endTime, setEndTime] = useState(DateUtil.getTodayEnd());
  const [reload, setReload] = useState(0);
  const [labInPageBean, setLabInPageBean] = useState({});

  // 由于两个页面复用，请求方法都为 reqLabInPageBeanByLabId，故不需要抽取成 reqMethod
  useEffect(async () => {
    // 请求数据
    const pageBean = await reqLabInPageBeanByLabId(labId, { page, labItemId, startTime, endTime });
    setLabInPageBean(pageBean);
  }, [reload, page, labItemId]);

  return (
    <div>
      <LabInDataTable labId={labId} labItemId={labItemId} pathname={pathname}
                      startTime={startTime} setStartTime={setStartTime}
                      endTime={endTime} setEndTime={setEndTime}
                      setReload={setReload}
                      labInPageBean={labInPageBean}
      />
    </div>
  );

};

export default LabInComponent;
