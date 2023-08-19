import ChatBox from './chatBox';
import './styles.css';

import React, { useEffect, useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, EnterOutlined, LoadingOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, theme, Col, Row, Input, Form } from "antd";
const { Content, Sider, Header } = Layout;
const { TextArea } = Input;

import axios from '../../utils/axios';
import authHeader from '../../store/auth-header';

function Chat() {

  // * Settings
  const contentLeftSide = 9, contentRightSide = 23 - contentLeftSide;
  const chatContainerRef = React.useRef(null);
  const [caseDetailForm] = Form.useForm();
  const [enterStatus, setEnterStatus] = useState(true);

  // * State
  const [collapsed, setCollapsed] = useState(false);
  const [chatInputValue, setChatInputValue] = useState('');
  const [contentLeftSiderValue, setContentLeftSiderValue] = useState({
    "事故發生日期": "",
    "事故發生時間": "",
    "事故發生地點": "",
    "被告駕駛交通工具": "",
    "原告駕駛交通工具": "",
    "行駛道路": "",
    "事發經過": "",
    "行進方向的號誌": "",
    "天候": "",
    "路況": "",
    "行車速度": "",
    "被告車輛損壞情形": "",
    "原告車輛損壞情形": "",
    "被告傷勢": "",
    "原告傷勢": ""
  });

  // * Items
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // ! 到時候刪除(假資料)
  const contentSiderName = ["chatBox1"].map((name, index) => {
    const key = String(index + 1);
    return {
      key,
      label: name,
      icon: <UserOutlined />,
    }
  })

  // ! (假資料) 需注意時間從「最舊」開始輸送
  const [chatContent, setChatContent] = useState([
    { userId: '1', snId: '1', character: 'chatBot', value: "你好，我可以幫你什麼？\n請簡述你所知道的案件狀況，包含時間地點、人員傷勢、車況，事發情況等等... ", createTime: '2023-07-18T05:44:00' },
  ]);

  // 確認輸入聊天內容
  const enterChatValue = async () => {

    if ( enterStatus == false ){ return ;}

    setChatContent(prevContent => [...prevContent,
      { userId: '1', snId: '1', character: 'questioner', value: chatInputValue, createTime: '2023-07-18T05:44:00' },
      { userId: '1', snId: '1', character: 'chatBot', value: <LoadingOutlined style={{ fontSize: 24 }} spin />, createTime: '2023-07-18T05:44:00' }]
    );
    setChatInputValue(null);

    const request = {
      "content": chatInputValue,
      "incidentJson": contentLeftSiderValue
    }
    setEnterStatus(false);

    await axios
      .post('/chatGPT/templateJSON', request, {
        headers: authHeader(),
      })
      .then(response => {
        console.log("🚀 ~ file: index.js:82 ~ enterChatValue ~ response:", response)

        // - 對話紀錄的更改
        const responseContent = response.data.content;
        setChatContent(prevContent => {
          const newContent = prevContent.slice(0, prevContent.length - 1);  // 複製前面的所有資料，除了最後一筆

          // 將修改後的資料追加到新陣列中
          newContent.push({ userId: '1', snId: '1', character: 'chatBot', value: responseContent, createTime: '2023-07-18T05:44:00' });
          return newContent;
        });

        // - JSON 紀錄的修改
        const myJsonResponse = response.data.incidentJson;
        setContentLeftSiderValue(myJsonResponse);

        setEnterStatus(true);
        
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  // + 一次輸出聊天紀錄
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

  // + 一次輸出聊天紀錄
  const RenderFieldValue = () => {
    return Object.entries(contentLeftSiderValue).map(([key, value]) => {
        return (
            <Form.Item key={key} label={key}>
                <Input
                    id={key}
                    name={key}
                    placeholder={`currently unknown .... `}
                    disabled
                    value={value}
                />
            </Form.Item>
        );
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        enterChatValue();
    }
  };


  React.useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    RenderChatBoxes();
  }, [chatContent]);


  return (

    <Content>
      <Layout style={{ padding: "24px 0 0 0", height: '100%' }}>

        {/* Left sider */}
        <Sider width={200} collapsed={collapsed} style={{ background: colorBgContainer, overflow: 'auto', height: '100%' }}>
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
              <Col span={contentLeftSide} className="code-box" style={{ overflow: 'auto' }} >
                <div style={{ padding: '20px 10px 5px 10px' }}>
                  <Form form={caseDetailForm} layout="vertical" >

                    {<RenderFieldValue />}

                    {/* <Form.Item label='提問者名稱' >
                      <Input
                        id="name" name="name" placeholder='Please enter your name.' disabled
                        value={contentLeftSideValue.name} />
                    </Form.Item> */}
                    

                    <div style={{ textAlign: 'center' }}>
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
                        <TextArea
                          placeholder='Please Write Here.'
                          value={chatInputValue}
                          onChange={(e) => setChatInputValue(e.target.value)}
                          onKeyDown={handleKeyDown}/>
                      </Col>
                      <Col span={1} >
                        <Button icon={<EnterOutlined />} style={{ height: '100%' }} onClick={enterChatValue} ></Button>
                      </Col>
                    </Row>
                  </div>

                  {/* 上半部分: 對話紀錄 */}
                  <div style={{ overflow: 'auto' }} ref={chatContainerRef}> <RenderChatBoxes /> </div>

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
