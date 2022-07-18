import React, { useState, useEffect } from 'react';
import { Col, Row } from 'antd';


const OpButtons = (props) => {

  const {children} = props;

  const cols = [];

  children.map((item, idx) => {
    if (item) {
      cols.push(<Col xs={24} sm={24} md={12} lg={12} xl={8} style={{padding: '2px'}} key={idx}>{item}</Col>);
    }
  })

  return (
    <Row gutter={16}>
      {cols}
    </Row>
  );
};

export default OpButtons;
