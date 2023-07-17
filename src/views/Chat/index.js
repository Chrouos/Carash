import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined} from '@ant-design/icons';

import React, { useState } from "react";
import { Layout, Menu, Button, theme } from "antd";
const { Content, Sider, Header} = Layout;


function Chat() {

  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const contentSiderName = ['ChatBot1', 'ChatBot2', 'ChatBot3', 'ChatBot4'].map((name, index) => {
    const key = String(index + 1);
    return {
      key,
      label: name,
      icon: <UserOutlined />,
      // children: {key, label}
    }
  })

  return (

    <Content>
        <Layout style={{ padding: "24px 0",  height: '100%' }}>

        {/* Left sider */}
        <Sider width={200} collapsed={collapsed}>
            <Menu
            mode="inline"
            style={{height: '100%', background: colorBgContainer}}
            items={contentSiderName}
            > 
            </Menu>
        </Sider>

        {/* Right Content */}
        <Content style={{padding: '0 24px', minHeight: 280, background: colorBgContainer}}>
          <Header style={{ padding: 0,  background: colorBgContainer}}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            /> </Header>

            Content
          </Content>
        </Layout>
    </Content>

  );
}

export default Chat;
