import React, { useState } from 'react';
import { Button, Card, Col, Row } from 'antd';
import LabCard from '@/pages/lab/components/LabCard';
import SaveLabModal from '@/pages/lab/components/SaveLabModal';

const LabList = (props) => {

  // props
  const { labEntryVOList, own = true, setReload } = props;

  // state
  const [showCreateLabModal, setShowCreateModal] = useState(false);
  const [lab, setLab] = useState({});

  const cardTitle = '实验室列表';

  const getCardExtra = () => {

    const onCreateClick = (event) => {
      setLab({});
      setShowCreateModal(true);
    }

    return (
      <Button type="primary" onClick={onCreateClick}>创建</Button>
    );
  }

  return (
    <Card title={<h2>{cardTitle}</h2>} extra={getCardExtra()}>
      <Row>
        {labEntryVOList && labEntryVOList.map((labEntryVO) => {
          return (
            <Col xs={24} sm={12} md={9} lg={8} xl={6}
                 key={`addedIn-${labEntryVO.id}`}
                 style={{ padding: '10px' }}>
              <LabCard lab={labEntryVO} own={own} />
            </Col>
          );
        })}
      </Row>
      <SaveLabModal visible={showCreateLabModal} setVisible={setShowCreateModal}
                    setReload={setReload}
                    lab={lab}
      />
    </Card>

  );
};

export default LabList;
