import ChatBox from './chatBox';
import './styles.css';

import axios from '../../utils/axios';
import authHeader from '../../store/auth-header';

import React, { useState, useRef } from "react";
import { Layout, Menu, Button, theme, Col, Row, Input, Form, Modal, Table } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, EnterOutlined, LoadingOutlined, CaretRightFilled } from '@ant-design/icons';
const { Column } = Table;
const { Content, Sider, Header } = Layout;
const { TextArea } = Input;




function Chat() {

  const incidentTemplate = {
    "車禍發生事故": {
      "事故發生日期": "",
      "事故發生時間": "",
      "事故發生地點": "",
      "對方駕駛交通工具": "",
      "我方駕駛交通工具": "",
      "我方行駛道路": "",
      "事發經過": "",
      "我方行進方向的號誌": "",
      "當天天候": "",
      "道路狀況": "",
      "我方行車速度": "",
      "我方車輛損壞情形": "",
      "我方傷勢": "",
      "對方車輛損壞情形": "",
      "對方傷勢": "",
      "我方從哪裡出發": "",
      "我方出發目的地": "",
      "我方出發目的是什麼": "",
    },
    "車輛詳細狀況": {
      "是否有修車估價單": "",
      "車輛出廠年月": "",
      "修車費用": "",
      "零件費用": "",
      "材料費用": "",
      "工資費用": "",
      "板金費用": "",
      "塗裝費用": "",
      "烤漆費用": "",
    },
    "醫療詳細狀況": {
      "是否有醫療費用單": "",
      "醫療費用": "",
      "看護費用": "",
      "看護天數": "",
      "看護價格": "",
    },
    "其他費用賠償": {
      "交通費用": "",
      "財產損失": "",
      "營業損失": "",
      "工作損失": "",
      "精神賠償": "",
    },
  };


  // * Settings
  const contentLeftSide = 9, contentRightSide = 23 - contentLeftSide;
  const [caseDetailForm] = Form.useForm();
  const [enterStatus, setEnterStatus] = useState(true);

  // * Ref
  const chatContainerRef = useRef(null);

  // * State
  const [collapsed, setCollapsed] = useState(false);
  const [chatInputValue, setChatInputValue] = useState('');
  const [incidentJsonSiderValue, setIncidentJsonSiderValue] = useState(incidentTemplate); // + incident Json
  const [showJsonSider, setshowJsonSider] = useState(incidentTemplate["車禍發生事故"]);
  const [selectSection, setSelectSection] = useState("車禍發生事故");
  const [isInputEnabled, setIsInputEnabled] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(""); // + Title
  const [currentIds, setCurrentIds] = useState(null); // + Ids
  const [questionValue, setQuestionvalue] = useState("");
  const [judgementId, setJudgementId] = useState(1) // judgementId

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPredictorMoney, setModalPredictorMoney] = useState("");
  const [modalSimilarVerdict, setModalSimilarVerdict] = useState("");
  const [modalGetHappened, setModalGetHappened] = useState("");


  // + Items
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
    if (enterStatus === false) { return; }
    setEnterStatus(false);

    // - 傳送給 API 的內容
    var request = {
      "content": chatInputValue,
      "question": questionValue,
      "incidentJson": incidentJsonSiderValue,
      "title": currentTitle,
      "chatContent": chatContent,
      "selectSection": selectSection,
    }
    if (currentIds) {
      request['_id'] = currentIds;
    }
    console.log("request'ids is : ", request['_id']);

    // - 使用者先輸入內容後的顯示畫面
    setChatContent(prevContent => [...prevContent,
    { character: 'questioner', value: chatInputValue, createTime: '2023-07-18T05:44:00' },
    { character: 'chatBot', value: <LoadingOutlined style={{ fontSize: 24 }} spin />, createTime: '2023-07-18T05:44:00' }]
    );
    setChatInputValue(null);

    if (selectSection === "車禍發生事故") {
      await axios
        .post('/chatGPT/templateJSON', request, {
          headers: authHeader(),
        })
        .then(response => {

          // - 修改狀態
          setCurrentIds(response.data._id);
          setCurrentTitle(response.data.title);
          setQuestionvalue(response.data.question);

          // - 對話紀錄的更改
          const responseContent = response.data.chatContent;
          setChatContent(responseContent);

          // - JSON 紀錄的修改
          const myJsonResponse = response.data.incidentJson;
          setIncidentJsonSiderValue(myJsonResponse);
          setshowJsonSider(myJsonResponse["車禍發生事故"]);

          // - 防呆結束：防止二次輸入
          setEnterStatus(true);

        })
        .then(() => {
          fetchingTitle();
        })
        .catch(error => console.error('Error fetching data:', error));
    }
    else if (selectSection === "車輛詳細狀況" || selectSection === "醫療詳細狀況") {

      await axios
        .post('/chatGPT/carmedJSON', request, {
          headers: authHeader(),
        })
        .then(response => {

          // - 修改狀態
          setCurrentIds(response.data._id);
          setCurrentTitle(response.data.title);
          setQuestionvalue(response.data.question);

          // - 對話紀錄的更改
          const responseContent = response.data.chatContent;
          setChatContent(responseContent);

          // - JSON 紀錄的修改
          const myJsonResponse = response.data.incidentJson;
          setIncidentJsonSiderValue(myJsonResponse);
          setshowJsonSider(myJsonResponse[`${selectSection}`]);

          // - 防呆結束：防止二次輸入
          setEnterStatus(true);

        })
        .then(() => {
          fetchingTitle();
        })
        .catch(error => console.error('Error fetching data:', error));
    }
    else {

      await axios
        .post('/chatGPT/otherJSON', request, {
          headers: authHeader(),
        })
        .then(response => {

          // - 修改狀態
          setCurrentIds(response.data._id);
          setCurrentTitle(response.data.title);
          setQuestionvalue(response.data.question);

          // - 對話紀錄的更改
          const responseContent = response.data.chatContent;
          setChatContent(responseContent);

          // - JSON 紀錄的修改
          const myJsonResponse = response.data.incidentJson;
          setIncidentJsonSiderValue(myJsonResponse);
          setshowJsonSider(myJsonResponse[`${selectSection}`]);

          // - 防呆結束：防止二次輸入
          setEnterStatus(true);

        })
        .then(() => {
          fetchingTitle();
        })
        .catch(error => console.error('Error fetching data:', error));

    }

  }

  // -------------------- 獲得全部聊天紀錄名稱
  const fetchingTitle = async () => {
    const request = {}

    await axios
      .get('/chatGPT/getTitle', request, {
        headers: authHeader(),
      })
      .then(response => {

        // - 將資料整理後設為可選擇 Menu
        const newTitleSider = response.data.titles.map((item, index) => {
          return {
            key: item._id,
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
        setChatContent(response.data.chatContent);
        setIncidentJsonSiderValue(response.data.incidentJson);
        setCurrentTitle(response.data.title);
        setshowJsonSider(response.data.incidentJson["車禍發生事故"]);
        setSelectSection("車禍發生事故");
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  // -------------------- 當事人Agent response
  const gptChat = async () => {

    // - 防呆：防止二次輸入
    if (enterStatus === false) { return; }
    setEnterStatus(false);

    // API 內容
    var request = {
      "content": chatInputValue,
      "chatContent": chatContent,
      "judgementId": judgementId
    }
    var gptResponse = ""

    await axios
      .post('/chatGPT/gptChat', request, {
        headers: authHeader(),
      })
      .then(response => {

        // - 修改狀態
        gptResponse = response.data.content;

        // - 防呆結束：防止二次輸入
        setEnterStatus(true);

      })
      .then(() => {
      })
      .catch(error => console.error('Error gptChat:', error));


    // 輸入給CCG
    var request = {
      "content": gptResponse,
      "question": questionValue,
      "incidentJson": incidentJsonSiderValue,
      "title": currentTitle,
      "chatContent": chatContent,
      "selectSection": selectSection,
    }
    if (currentIds) {
      request['_id'] = currentIds;
    }
    console.log("request'ids is : ", request['_id']);

    // - 使用者先輸入內容後的顯示畫面
    setChatContent(prevContent => [...prevContent,
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
        setCurrentIds(response.data._id);
        setCurrentTitle(response.data.title);
        setQuestionvalue(response.data.question);

        // - 對話紀錄的更改
        const responseContent = response.data.chatContent;
        setChatContent(responseContent);

        // - JSON 紀錄的修改
        const myJsonResponse = response.data.incidentJson;
        setIncidentJsonSiderValue(myJsonResponse);
        setshowJsonSider(myJsonResponse["車禍發生事故"]);

        // - 防呆結束：防止二次輸入
        setEnterStatus(true);

      })
      .then(() => {
        fetchingTitle();
      })
      .catch(error => console.error('Error fetching data:', error));

  }

  // -------------------- 預測金額頁面
  const showPredict = async () => {

    setIsModalOpen(true);
    setModalPredictorMoney(
      <>
        <span>請等待... 正在計算中... {'\u00A0\u00A0\u00A0\u00A0'}</span>
        <LoadingOutlined style={{ fontSize: 24 }} spin />
      </>
    );

    const request = {
      "happened": incidentJsonSiderValue["車禍發生事故"]["事發經過"],
      "incidentJson": incidentJsonSiderValue["車禍發生事故"],
      "ids": currentIds
    }

    try {
      await axios
        .post('/chatGPT/similarVerdict', request, {
          headers: authHeader(),
        })
        .then(response => {
          const processResponse = response.data.map((item) => { return { key: item.id, ...item } })

          setModalSimilarVerdict(
            <>
              <Table style={{ width: '100%', marginTop: '5%' }} dataSource={processResponse} >
                <Column title="Happened" dataIndex="happened" key="happened" />
                <Column title="Money" dataIndex="money" key="money" />
              </Table>
            </>
          )
        })
        .catch(e => console.log('Error in similarVerdict:', e));


      const saveFile = await axios.post('/python/save_predictor_file', request, { headers: authHeader() }).catch(e => console.log('Error in predictorMoney:', e));
      await new Promise(resolve => setTimeout(resolve, 1000));  // 1 second delay

      const predictorMoney = await axios.post('/python/predictor_money', request, { headers: authHeader() }).catch(e => console.log('Error in predictorMoney:', e));
      const getHappened = axios.post('/chatgpt/getHappened', request, { headers: authHeader() }).catch(e => console.log('Error in getHappened:', e))

      await Promise.all([saveFile, predictorMoney, getHappened])
        .then((responses) => {

          if (responses[1] && responses[1].data) {
            const response_predictorMoney = responses[1];
            setModalPredictorMoney(
              <p>預測金額為： {parseInt(response_predictorMoney.data.predictor_money)}</p>
            );
          }

          if (responses[2] && responses[2].data) {
            const response_getHappened = responses[2];
            setModalGetHappened(
              <p>事發經過 : {response_getHappened.data}</p>
            );
          }

        })
        .catch((error) => {
          console.log("🚀 ~ file: index.js:207 ~ showPredict ~ error:", error)
        });
    }
    catch (error) {
      console.log("🚀 ~ file: index.js:231 ~ showPredict ~ error:", error)
    }

  };

  // -------------------- 更換左側顯示Json頁面
  const showNextJsonSider = () => {

    if (selectSection === "車禍發生事故") {
      setshowJsonSider(incidentJsonSiderValue["車輛詳細狀況"]);
      setSelectSection("車輛詳細狀況");
      setIsInputEnabled(false);

      setChatContent(prevContent => [...prevContent,
      { character: 'chatBot', value: "是否有修車估價單?", createTime: '2023-07-18T05:44:00' },
      ]
      );
      setQuestionvalue("是否有修車估價單?");

    }
    else if (selectSection === "車輛詳細狀況") {
      setshowJsonSider(incidentJsonSiderValue["醫療詳細狀況"]);
      setSelectSection("醫療詳細狀況");
      setIsInputEnabled(false);

      setChatContent(prevContent => [...prevContent,
      { character: 'chatBot', value: "是否有醫療費用單?", createTime: '2023-07-18T05:44:00' },
      ]
      );
      setQuestionvalue("是否有醫療費用單?");

    }
    else if (selectSection === "醫療詳細狀況") {
      setshowJsonSider(incidentJsonSiderValue["其他費用賠償"]);
      setSelectSection("其他費用賠償");
      setIsInputEnabled(false);

      setChatContent(prevContent => [...prevContent,
      { character: 'chatBot', value: "請問交通費用大約多少?", createTime: '2023-07-18T05:44:00' },
      ]
      );
      setQuestionvalue("請問交通費用大約多少?");
    }
    else if (selectSection === "其他費用賠償") {
      setshowJsonSider(incidentJsonSiderValue["車禍發生事故"]);
      setSelectSection("車禍發生事故");
      setIsInputEnabled(false);
    }

  }

  // -------------------- NewChat
  const createNewChat = () => {
    setCurrentIds(null);
    setCurrentTitle(null);
    setChatInputValue(null);
    setChatContent([{ character: 'chatBot', value: "你好，我可以幫你什麼？\n請簡述你所知道的案件狀況，包含時間地點、人員傷勢、車況，事發情況等等... ", createTime: '2023-07-18T05:44:00' },])
    setIncidentJsonSiderValue(incidentTemplate);
    setshowJsonSider(incidentTemplate["車禍發生事故"]);
    setSelectSection("車禍發生事故");
    setJudgementId(Math.round(Math.random() * 97))
    console.log("judgementId = :", judgementId)
    console.log("now is createNewChat")
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
    return Object.entries(showJsonSider).map(([key, value]) => {
      return (
        <Form.Item key={key}>
          <label htmlFor={key}>{key}</label>
          <Input
            id={key}
            name={key}
            placeholder={`currently unknown .... `}
            disabled={!isInputEnabled}
            value={value}
          />
        </Form.Item>
      )
    })
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
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
    createNewChat();
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
            onClick={(e) => { fetchingContentJson(e.key) }}
          />
        </Sider>

        {/* Right Content */}
        <Content style={{ padding: '0 24px', minHeight: 280 }}>

          <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: '16px', width: 64, height: 64 }}
              />
              <label htmlFor="title">標題： </label>
              <Input
                id="title"
                value={currentTitle}
                onChange={(e) => setCurrentTitle(e.target.value)}
                placeholder='Please enter this chat title, default = NewtestChat'
                style={{ width: '350px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', paddingRight: '3%' }}>
              <Button style={{ width: '150px' }} onClick={() => { createNewChat() }}>New Chat</Button>
            </div>

          </Header>


          <div style={{ padding: '24px 0 0 0', marginTop: 8, height: '90%' }}>
            <Row gutter={[16, 8]} justify="space-evenly" style={{ height: '100%' }}>

              {/* 左邊: 案件資訊 */}
              <Col span={contentLeftSide} className="code-box" style={{ overflow: 'auto' }} >
                <div style={{ padding: '20px 10px 5px 10px' }}>
                  <Form form={caseDetailForm} layout="vertical" >

                    {<RenderFieldValue />}


                    <div style={{ textAlign: 'center' }}>
                      <Button icon={<EnterOutlined />} onClick={showPredict}> 確認輸出內容 </Button>
                      <Button icon={<EnterOutlined />} onClick={showNextJsonSider}> 下一步 </Button>
                      <Modal
                        width={'65%'}
                        bodyStyle={{ height: '80vh', overflowY: 'auto' }}
                        style={{ position: 'absolute', left: '15%', top: '5%' }}
                        title="預測金額與相似判決"
                        open={isModalOpen}
                        onOk={handleModalClose}
                        onClick={handleModalClose}
                        onCancel={handleModalClose}
                      >
                        <div>
                          {modalPredictorMoney}
                          <br />
                          {modalGetHappened}
                          <br />
                          {modalSimilarVerdict}
                        </div>
                      </Modal>
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
                          onKeyDown={handleKeyDown} />
                      </Col>
                      <Col span={1} >
                        <Button icon={<EnterOutlined />} style={{ height: '100%' }} onClick={enterChatValue} ></Button>
                      </Col>
                      <Col span={1} >
                        <Button icon={<CaretRightFilled />} style={{ height: '100%' }} onClick={gptChat} ></Button>
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
