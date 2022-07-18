import React, { useEffect, useState } from 'react';
import RouteUtil from '@/utils/RouteUtil';
import LabShelfDataTable
  from '@/pages/lab/[labId]/lab/shelf/components/LabShelfDataTable';
import { useModel } from 'umi';

const Index = (props) => {
  const labId = RouteUtil.getPathParam(props, 'labId');

  // state
  const [reload, setReload] = useState(0);

  // model
  const { currentLabShelfList = [], refreshCurrentLabShelfList } = useModel('CurrentModel');

  // 初始化数据
  const doInit = () => {
    useEffect(async () => {
      refreshCurrentLabShelfList(labId);
    }, [reload]);

  };

  doInit();


  return (
    <div>
      <LabShelfDataTable
        labShelfList={currentLabShelfList}
        labId={labId}
        setReload={setReload}
        my={false}
      />
    </div>
  );
};

export default Index;
