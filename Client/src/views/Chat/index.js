import ChatBox from './chatBox';
import './styles.css';

import React, { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, EnterOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, theme, Col, Row, Input, Form } from "antd";
const { Content, Sider, Header } = Layout;
const { TextArea } = Input;


function Chat() {

  // * Settings
  const contentLeftSide = 9, contentRightSide = 23 - contentLeftSide;
  const chatContainerRef = React.useRef(null);
  const [caseDetailForm] = Form.useForm();

  // * State
  const [collapsed, setCollapsed] = useState(false);
  const [chatInputValue, setChatInputValue] = useState('');
  const [contentLeftSideValue, ] = useState({
    id: '1', name: '1', car: '重型機車', place: '新北市', happened: '原應注意車前狀況，隨時採取必要之安全措施，並應遵守道路交通號誌行駛，且依當時並無不能注意之情事，竟疏未注意，闖越紅燈，不慎撞擊原告林泰名騎乘車牌號碼000-000號普通重型機車之右側，至原告林泰名人車倒地'
  });
  
  // * Items
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
    { userId: 'bot1Chat', snId: 'chat000001', character: 'chatBot', value: '你好，請敘述您車禍過程!', createTime: '2023-07-18T05:46:00' },
    { userId: 'fakeUser12345', snId: 'chat000001', character: 'questioner', value: '我在新北中山路闖紅燈，不小心撞到人', createTime: '2023-07-18T05:44:00' },
    { userId: 'bot1Chat', snId: 'chat000001', character: 'chatBot', value: '請問你騎的車型是?', createTime: '2023-07-18T05:46:00' },
    { userId: 'fakeUser12345', snId: 'chat000001', character: 'questioner', value: '普通重型機車', createTime: '2023-07-18T05:48:00' },
    { userId: 'bot1Chat', snId: 'chat000001', character: 'chatBot', value: '請問發生時間是?', createTime: '2023-07-18T05:46:00' },

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
        <Sider width={200} collapsed={collapsed} style={{ background: colorBgContainer, overflow: 'auto', height: '100%'  }}>
          <Menu
            mode="inline"
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

          
          <div style={{ padding: '24px 0 0 0', marginTop: 8, height: '90%' }}>
            <Row gutter={[16, 8]} justify="space-evenly" style={{ height: '100%' }}>

              {/* 左邊: 案件資訊 */}
              <Col span={contentLeftSide}  className="code-box" style={{overflow: 'auto'}} > 
                <div style={{padding: '20px 10px 5px 10px'}}>
                  <Form  form={caseDetailForm} layout="vertical" >
                    <Form.Item label='提問者名稱' >
                      <Input 
                        id="name" name="name" placeholder='Please enter your name.' disabled  
                        value={contentLeftSideValue.name}/>
                    </Form.Item>
                    <Form.Item label='事發地點' >
                      <Input 
                        id="place" name="place" placeholder='Where did the accident happen.'disabled
                        value={contentLeftSideValue.place} />
                    </Form.Item>
                    <Form.Item label='事發時間' >
                      <Input id="time" name="time" placeholder='............'disabled
                      value={contentLeftSideValue.time} />
                    </Form.Item>
                    <Form.Item label='車型' >
                      <Input id="car" name="car" placeholder='..........'disabled
                      value={contentLeftSideValue.car} />
                    </Form.Item>
                    <Form.Item label='傷勢' >
                      <Input id="injury" name="injury" placeholder='..........'disabled
                      value={contentLeftSideValue.injury} />
                    </Form.Item>
                    <Form.Item label='發生經過' >
                      <TextArea id="happened" name="happened" placeholder='..........'disabled
                      value={contentLeftSideValue.happened} />
                    </Form.Item>
                    <Form.Item label='可能賠償金額' >
                      <Input id="amount" name="amount" placeholder='Forecast the amount of possible compensation.'disabled
                      value={contentLeftSideValue.amount} />
                    </Form.Item>

                    <div style={{textAlign: 'center'}}>
                      <Button icon={<EnterOutlined />} > 確認輸出內容 </Button>
                    </div>
                  </Form>
                </div> 
              </Col>

              {/* 右邊: 對話框，由下到上排列  */}
              <Col span={contentRightSide} className="code-box">
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
