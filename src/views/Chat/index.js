import React from "react";
import { Layout, theme, Menu } from "antd";
const { Content, Sider } = Layout;

function Chat() {

  const {
    token: { colorBgContainer }, // # ffffff
  } = theme.useToken();

  const contentSiderName = ['ChatBot1', 'ChatBot2', 'ChatBot3', 'ChatBot4'].map((name, index) => {
    const key = String(index + 1);
    return {
      key,
      label: name,
      // children: {key, label}
    }
  })

  return (

    <Content>
        <Layout style={{ padding: "24px 0", background: colorBgContainer, height: '100%' }}>

        {/* Left sider */}
        <Sider style={{ background: colorBgContainer }} width={200}>
            <Menu
            mode="inline"
            style={{height: '100%'}}
            items={contentSiderName}
            ></Menu>
        </Sider>

        {/* Right Content */}
        <Content style={{padding: '0 24px', minHeight: 280}}>Content</Content>

        </Layout>
    </Content>

  );
}

export default Chat;
