import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, EnterOutlined} from '@ant-design/icons';

import React, { useState } from "react";
import { Layout, Menu, Button, theme, Col, Row, Input, } from "antd";
const { Content, Sider, Header} = Layout;


function Chat() {

  const [collapsed, setCollapsed] = useState(false);
  const [chatInputValue, setChatInputValue] = useState('');

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // ! 到時候刪除(假資料)
  const contentSiderName = ['ChatBot1', 'ChatBot2', 'ChatBot3', 'ChatBot4', 'ChatBot5', 'ChatBot6'
  , 'ChatBot6', 'ChatBot6', 'ChatBot6', 'ChatBot6', 'ChatBot6', 'ChatBot6', 'ChatBot6', 'ChatBot6', 'ChatBot6'].map((name, index) => {
    const key = String(index + 1);
    return {
      key,
      label: name,
      icon: <UserOutlined />,
      // children: {key, label}
    }
  })

  // 確認輸入聊天內容
  const enterChatValue = () => {
    console.log(chatInputValue);
  }



  return (

    <Content>
        <Layout style={{ padding: "24px 0 0 0",  height: '100%' }}>

        {/* Left sider */}
        <Sider width={200} collapsed={collapsed} style={{ background: colorBgContainer, overflow: 'auto'}}>
            <Menu
              mode="inline"
              style={{height: '100%'}}
              items={contentSiderName}
            > 
            </Menu>
        </Sider>

        {/* Right Content */}
        <Content style={{padding: '0 24px', minHeight: 280}}>
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


            <div style={{padding: 24, marginTop: 8, height: '90%', background: colorBgContainer}}>
              <Row gutter={[16, 8]} style={{height: '100%'}}>

                {/* 左邊: 案件資訊 */}
                <Col span={8} style={{height: '100%', border: 'solid black'}}> 案件資訊 </Col>


                {/* 右邊: 對話框 */}
                <Col span={16} style={{height: '100%', border: 'solid black'}}> 
                  <div style={{background: 'gray', height:'100%', display: 'flex', flexDirection: 'column-reverse'}}>
                    
                    {/* 下半部分輸入框 */}
                    <div style={{margin: '10px 0px'}}>
                      <Row justify="space-evenly">
                        <Col span={22} >
                          <Input  
                            placeholder='Please Enter Somting... ' 
                            onChange={(e) => setChatInputValue(e.target.value)}
                            onPressEnter={enterChatValue} />
                        </Col>
                        <Col span={1} >
                          <Button icon={<EnterOutlined />} onClick={enterChatValue} ></Button>
                        </Col>
                      </Row>
                    </div>

                  </div>
                </Col>

              </Row>
            </div>

            
          </Content>
        </Layout>
    </Content>

  );
}

export default Chat;
