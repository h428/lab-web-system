import React, { useState, useEffect } from 'react';
import { Card, Col, Row } from 'antd';
import styles from './DataWrapper.less'

// 用于响应式布局的 Wrapper 组件
// 第一行：left, right，类似 Card 的头部
// 第二行：search
// 内容：children
const DataWrapper = (props) => {

  const {left, right, children, searchBox} = props;

  return (
    <div>
      <Row>
        <Col xs={24} sm={14} md={16} >
          {left}
        </Col>
        <Col xs={24} sm={10} md={8}>
          <div className={styles.right}>
            <div style={{paddingRight: 10}}>
              {right}
            </div>
          </div>
        </Col>
      </Row>
      {searchBox && (
        <Row style={{marginTop: 10}}>
            <Col xs={24}>
              {searchBox}
            </Col>
        </Row>
      )}
      <Row style={{marginTop: 10}}>
        <Col xs={24}>
          <Card>
            {children}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DataWrapper;
