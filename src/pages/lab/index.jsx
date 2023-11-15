import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Col, Row, Tabs } from 'antd';
import MainPageLayout from '@/layouts/MainPageLayout';
import { reqAddedInLabEntryMap } from '@/services/LabService';
import LabList from '@/pages/lab/components/LabList';

const { TabPane } = Tabs;

const Index = (props) => {
  // 页面基础数据
  const [reload, setReload] = useState(0);
  const [addedInLabEntryMap, setAddedInLabEntryMap] = useState([]);
  const [addedInLabEntryVOList, setAddedInLabEntryVOList] = useState([]);

  // model 数据
  const { labMap, refreshLabMap, labRoleMap, refreshLabRoleMap } =
    useModel('CacheModel');
  const { currentBaseUser } = useModel('CurrentModel');

  const doInit = () => {
    const cascadeRequestByLabEntryMap = (labEntryMap) => {
      // 分别取出键值对 list
      const labIdList = Object.keys(labEntryMap);
      const labEntryList = Object.values(labEntryMap);

      // 根据 labIdList 级联请求 lab 列表
      refreshLabMap(labIdList);

      // 根据 labRoleIdList 级联请求 labRole 信息，由于是不同实验室，需要按实验室请求
      labEntryList.forEach((labEntry) => {
        const labRoleId = labEntry.labRoleId;
        const labId = labEntry.labId;
        if (labRoleId) {
          refreshLabRoleMap([labRoleId], labId);
        }
      });
    };

    // 加载以加入实验室数据
    useEffect(async () => {
      const addedInLabEntryMap = await reqAddedInLabEntryMap();
      cascadeRequestByLabEntryMap(addedInLabEntryMap);
      setAddedInLabEntryMap(addedInLabEntryMap);
    }, [reload]);

    // 页面数据组装辅助函数
    const labEntryMap2LabEntryVOList = (labEntryMap) => {
      const labEntryList = Object.values(labEntryMap);
      return labEntryList.map((labEntry) => {
        const id = labEntry.labId;

        const lab = labMap.get(labEntry.labId) || {};

        const own = lab.belongBaseUserId === currentBaseUser.id;

        const labEntryVO = Object.assign({ id, own }, labEntry, lab);

        const labRole = labRoleMap.get(labEntry.labRoleId) || {};
        labEntryVO.labRoleName = labRole.name;

        return labEntryVO;
      });
    };

    // 页面数据组装
    useEffect(() => {
      const labEntryVOList = labEntryMap2LabEntryVOList(addedInLabEntryMap);
      setAddedInLabEntryVOList(labEntryVOList);
    }, [addedInLabEntryMap, labMap, labRoleMap]);
  };

  doInit();

  return (
    <div>
      <MainPageLayout>
        <Row style={{ padding: '20px 35px' }}>
          <Col lg={{ span: 22, push: 1 }} xs={24}>
            <LabList
              labEntryVOList={addedInLabEntryVOList}
              setReload={setReload}
            />
          </Col>
        </Row>
      </MainPageLayout>
    </div>
  );
};

export default Index;
