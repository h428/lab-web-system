import React from 'react';
import { Link } from 'umi';
import { INDEX_DOMAIN, MODULE_LAB_PREFIX } from '@/common/Config';
import { Col, Layout, Menu, Row } from 'antd';
import { CopyrightOutlined } from '@ant-design/icons';
import MainPageAvatarDropdown from '@/components/layout/MainPageAvatarDropdown';

const { Header, Footer, Content } = Layout;

const MainPageLayout = (props) => {
  const {
    children
  } = props;

  const menuItems = [
    {
      label: <Link to={MODULE_LAB_PREFIX} style={{color: 'white'}}>实验室</Link>,
      key: 'lab'
    },
    // {
    //   label: <Link to={MODULE_GROUP_ORDER_PREFIX} style={{color: 'white'}}>拼单</Link>,
    //   key: 'group-order'
    // }
  ];

  return (
    <Layout>
      <Header>
        <Row>
          <Col span={4}>
            <h1 style={{ color: 'white' }}>
              <Link to={MODULE_LAB_PREFIX} style={{ color: 'white' }}>
                Labmate
              </Link>
            </h1>
          </Col>
          <Col span={16}>
            <Menu mode="horizontal" style={{background: 'inherit', color: 'white', border: 'none'}}
                  items={menuItems}
            />
          </Col>
          <Col span={4}>
            <div style={{ color: 'white', float: 'right' }}>
              <MainPageAvatarDropdown />
            </div>
          </Col>
        </Row>
      </Header>
      <Content>{children}</Content>
      <Footer style={{ textAlign: 'center' }}>
        Copyright <CopyrightOutlined />{' '}
        <span>
          {new Date().getFullYear()}
          <strong><a href={INDEX_DOMAIN} target='_blank'>Labmate</a></strong>
        </span>
      </Footer>
    </Layout>
  );
};

export default MainPageLayout;
