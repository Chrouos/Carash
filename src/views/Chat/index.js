import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, EnterOutlined } from '@ant-design/icons';
import ChatBox from './chatBox';

import React, { useState } from "react";
import { Layout, Menu, Button, theme, Col, Row, Input, } from "antd";
const { Content, Sider, Header } = Layout;


function Chat() {

  // * Settings
  const contentLeftSide = 10, contentRightSide = 23 - contentLeftSide;
  const chatContainerRef = React.useRef(null);

  // * State
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
    }
  )

  // ! (假資料) 需注意時間從「最舊」開始輸送
  const [chatContent, setChatContent] = useState([
    { userId: 'fakeUser12345', snId: 'chat000001', character: 'questioner', value: 'Hello!', createTime: '2023-07-18T05:44:00' },
    { userId: 'bot1Chat', snId: 'chat000001', character: 'chatBot', value: 'Nice to meet you!', createTime: '2023-07-18T05:46:00' },
    { userId: 'fakeUser12345', snId: 'chat000001', character: 'questioner', value: 'Bye!', createTime: '2023-07-18T05:48:00' },
    { userId: 'bot1Chat', snId: 'chat000001', character: 'chatBot', value: '我是機器人', createTime: '2023-07-18T05:46:00' },
  ]);

  // 確認輸入聊天內容
  const enterChatValue = () => {
    const newChatContent = [
      ...chatContent,
      { userId: 'fakeUser12345', snId: 'chat000001', character: 'questioner', value: chatInputValue, createTime: '2023-07-18T05:44:00' },
      { userId: 'fakeUser12345', snId: 'chat000001', character: 'chatBot', value: '固定回覆', createTime: '2023-07-18T05:44:00' },
    ];
    setChatContent(newChatContent);
    setChatInputValue('');
  }

  // 一次輸出聊天紀錄
  const RenderChatBoxes = () => {
    const renderList = [];
  
    chatContent.map((item, index) => {
      return renderList.push(
        <ChatBox
          key={index}
          userId={item.userId}
          snId={item.snId}
          character={item.character}
          value={item.value}
          createTime={item.createTime}
        />
      );
    });
  
    return renderList;
  };


  React.useEffect(()=>{
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [chatInputValue]);
  

  return (

    <Content>
      <Layout style={{ padding: "24px 0 0 0", height: '100%' }}>

        {/* Left sider */}
        <Sider width={200} collapsed={collapsed} style={{ background: colorBgContainer, overflow: 'auto' }}>
          <Menu
            mode="inline"
            style={{ height: '100%' }}
            items={contentSiderName}
          >
          </Menu>
        </Sider>

        {/* Right Content */}
        <Content style={{ padding: '0 24px', minHeight: 280 }}>
          
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
          </Header>

          
          <div style={{ padding: 24, marginTop: 8, height: '90%' }}>
            <Row gutter={[16, 8]} justify="space-evenly" style={{ height: '100%' }}>

              {/* 左邊: 案件資訊 */}
              <Col span={contentLeftSide} style={{ height: '100%', border: 'solid black' }}> 案件資訊 
              </Col>


              {/* 右邊: 對話框，由下到上排列  */}
              <Col span={contentRightSide} style={{ height: '100%', border: 'solid black' }}>
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column-reverse' }}>

                  {/* 下半部分: 輸入框 */}
                  <div style={{ margin: '10px 0px' }}>
                    <Row justify="space-evenly">
                      <Col span={22} >
                        <Input
                          placeholder='Please Enter Somting... '
                          value={chatInputValue}
                          onChange={(e) => setChatInputValue(e.target.value)}
                          onPressEnter={enterChatValue} />
                      </Col>
                      <Col span={1} >
                        <Button icon={<EnterOutlined />} onClick={enterChatValue} ></Button>
                      </Col>
                    </Row>
                  </div>

                  {/* 上半部分: 對話紀錄 */}
                  <div style={{overflow: 'auto'}} ref={chatContainerRef}> <RenderChatBoxes /> </div>

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
