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

  const incidentTemplate = {
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
  };

  // * Settings
  const contentLeftSide = 9, contentRightSide = 23 - contentLeftSide;
  const chatContainerRef = React.useRef(null);
  const [caseDetailForm] = Form.useForm();
  const [enterStatus, setEnterStatus] = useState(true);

  // * State
  const [collapsed, setCollapsed] = useState(false);
  const [chatInputValue, setChatInputValue] = useState('');
  const [incidentJsonSiderValue, setIncidentJsonSiderValue] = useState(incidentTemplate); // + incident Json
  const [currentTitle, setCurrentTitle] = useState(""); // + Title
  const [currentIds, setCurrentIds] = useState(null); // + Ids

  // * Items
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // + titlesSider: 所有聊天紀錄的名稱
  const [titlesSider, setTitlesSider] = useState([])

  // + chatContent: 聊天內容
  const [chatContent, setChatContent] = useState([
    { character: 'chatBot', value: "你好，我可以幫你什麼？\n請簡述你所知道的案件狀況，包含時間地點、人員傷勢、車況，事發情況等等... ", createTime: '2023-07-18T05:44:00' },
  ]);

  // -------------------- 確認輸入聊天內容
  const enterChatValue = async () => {

    // - 防呆：防止二次輸入
    if ( enterStatus == false ){ return ;}
    setEnterStatus(false);

    // - 傳送給 API 的內容
    var request = {
      "content": chatInputValue,
      "incidentJson": incidentJsonSiderValue,
      "title": currentTitle,
      "totalContent": chatContent,
    }
    if (currentIds){
      request['ids'] = currentIds;
    }

    // - 使用者先輸入內容後的顯示畫面
    setChatContent(prevContent => [ ...prevContent,
      { character: 'questioner', value: chatInputValue, createTime: '2023-07-18T05:44:00' },
      { character: 'chatBot', value: <LoadingOutlined style={{ fontSize: 24 }} spin />, createTime: '2023-07-18T05:44:00' }]
    );
    setChatInputValue(null);

    await axios
      .post('/chatGPT/templateJSON', request, {
        headers: authHeader(),
      })
      .then(response => {

        // - 修改狀態
        setCurrentIds(response.data.ids);
        setCurrentTitle(response.data.title);

        // - 對話紀錄的更改
        const responseContent = response.data.totalContent;
        setChatContent(responseContent);

        // - JSON 紀錄的修改
        const myJsonResponse = response.data.incidentJson;
        setIncidentJsonSiderValue(myJsonResponse);

        // - 防呆結束：防止二次輸入
        setEnterStatus(true);

        fetchingTitle();
        
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  // -------------------- 獲得全部聊天紀錄名稱
  const fetchingTitle = async () => {
    const request = {}

    await axios
      .post('/chatGPT/getTitle', request, {
        headers: authHeader(),
      })
      .then(response => {

        // - 將資料整理後設為可選擇 Menu
        const newTitleSider = response.data.map((item, index) => {
          // const key = String(index + 1);
          return {
            key: item.id,
            label: item.title,
            icon: <UserOutlined />,
          }
        })

        setTitlesSider(newTitleSider);   

      })
      .catch(error => console.error('Error fetching data:', error));
  }

  // -------------------- 從 Menu 獲得聊天紀錄與Json
  const fetchingContentJson = async (currentIds) => {
    const request = {
      ids: currentIds
    }
    setCurrentIds(currentIds);

    await axios
      .post('/chatGPT/getContentJson', request, {
        headers: authHeader(),
      })
      .then(response => {
        setChatContent(response.data.totalContent);
        setIncidentJsonSiderValue(response.data.incidentJson);
        setCurrentTitle(response.data.title)
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  const createNewChat = () => {
    setCurrentIds(null);
    setCurrentTitle(null);
    setChatContent([{ character: 'chatBot', value: "你好，我可以幫你什麼？\n請簡述你所知道的案件狀況，包含時間地點、人員傷勢、車況，事發情況等等... ", createTime: '2023-07-18T05:44:00' },])
    setIncidentJsonSiderValue(incidentTemplate);
  };


  // -------------------- 一次輸出聊天紀錄
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

  // -------------------- 一次輸出 Json 紀錄
  const RenderFieldValue = () => {
    return Object.entries(incidentJsonSiderValue).map(([key, value]) => {
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

  // -------------------- 進入頁面後就直接執行
  React.useEffect(() => {
    fetchingTitle();
  }, []) // 空陣列表示只在組件掛載時執行一次
  
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
          items={titlesSider}
          onClick={(e) => {fetchingContentJson(e.key)}}
        />
        </Sider>

        {/* Right Content */}
        <Content style={{ padding: '0 24px', minHeight: 280 }}>

        <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button type="text" 
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{fontSize: '16px', width: 64, height: 64}}
            />
            <Input 
              placeholder='Please enter this chat title, default = testChatBox' style={{width: '350px'}} 
              value={currentTitle}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', paddingRight: '3%' }}>
            <Button style={{width: '150px'}} onClick={() => {createNewChat()}}>New Chat</Button>
          </div>
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
