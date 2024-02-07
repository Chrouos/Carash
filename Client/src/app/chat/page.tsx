"use client";

import React, { ContextType, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

// - Antd
import {
    Col,
    Row,
    Menu,
    Layout
} from 'antd';
const { Sider, Content } = Layout;

import {
    ArrowRightOutlined, FileOutlined, PoweroffOutlined
} from '@ant-design/icons';

// - NextUI
import {
    Card, CardHeader, CardBody, CardFooter, 
    Divider, 
    Input, Button,
    Textarea, 
    Tabs, Tab
} from "@nextui-org/react";

// - 自己寫的元件
import SpeechBubbles from './(components)/SpeechBubbles';
import AccidentDetailJson from './(components)/AccidentDetailJson';
import "../../styles/loading.css"

import { getTaiwanTime, toHumanReadable } from 'utils/TimeTw';
import axios from '../../utils/Axios';
import authHeader from '../../components/store/AuthHeader';

// - Date Template
import { accidentDetails, AccidentDetailsType, ChatContentType} from 'data/accidentDetails';

export default function Chat() {

    // ---------------------------------------- Variables ----------------------------------------
    const router = useRouter()

    // : 畫面
    const [colSizeDict, setColSizeListDict] = useState({rightPanel_divSize: 0})
    
    // : 選單
    const [titlesSider, setTitlesSider] = useState<{ key: string, label: string, icon: JSX.Element }[]>([]); // = 對話歷史紀錄（所有標題）

    // : 聊天內容
    const [userDescription, setUserDescription] = useState<string>(''); // = 使用者當前輸入的內容
    const [ccgCurrentQuestion, setCCGCurrentQuestion] = useState<string>("車禍發生事故"); // = CCG 當前的問題
    const [currentAccidentDetails, setCurrentAccidentDetails] = useState<AccidentDetailsType>(accidentDetails); // = 當前車禍資料內容

    // : 生成視窗框
    const [rightPanelSelect, setRightPanelSelect] = useState<string>("事件細節")
    
    // ---------------------------------------- API ----------------------------------------
    
    // ----- 輸入對話內容
    const API_retrievalContent = async (new_historyChatContent: ChatContentType[], isNewConversation: boolean) => {

        const request = {
            userDescription: userDescription,
            verificationCode: localStorage.getItem("verificationCode")|| "",
            ccgCurrentQuestion: ccgCurrentQuestion,
            incidentJson: currentAccidentDetails.incidentJson,
            title: currentAccidentDetails.title,
            _id: currentAccidentDetails._id,
            historyChatContent: new_historyChatContent,
        }

        try {

            const response = await axios.post('/accidentDetails/retrievalContent', request, { headers: authHeader() });

            // @ 增加對話
            setCurrentAccidentDetails(prevState => ({
                // ...prevState,
                incidentJson: response.data.incidentJson,
                historyChatContent: response.data.historyChatContent,
                title: response.data.title,
                _id: response.data._id
            }));   

            // @ 刷新 titleSlider
            if (isNewConversation) { API_fetchAccidentDetailsTitle(); }
            
            // @ 更新當前問題   
            setCCGCurrentQuestion(response.data.ccgCurrentQuestion)

        } catch (error) {
            console.error('[enterChatValue] Error: ', error);
        }
    }

    // ----- 獲得資料標題
    const API_fetchAccidentDetailsTitle = async () => {

        const request = {
            verificationCode: localStorage.getItem("verificationCode") || "",
        }

        try {
            const response = await axios.post('/accidentDetails/getAccidentDetailsTitle', request, { headers: authHeader() });
            const newTitleSider = response.data.titles.map((item: {_id: string, title: string}, index: number) => {               
                return {
                    key: item._id,
                    label: item.title,
                    icon: <FileOutlined />
                }
            })
            setTitlesSider(newTitleSider);

        } catch (error) {
            console.error('[enterChatValue] Error: ', error);
        }
    }

    // ----- 從 Sider 選擇標題後得到內容
    const API_fetchAccidentDetailsContent = async (_id: string) => {
        
        const request = { _id }

        try {
            const response = await axios.post('/accidentDetails/getContentAndJson', request, { headers: authHeader() });
            setCurrentAccidentDetails(prevState => ({
                // ...prevState,
                incidentJson: response.data.incidentJson,
                historyChatContent: response.data.historyChatContent,
                title: response.data.title,
                _id: response.data._id
            }));   

        } catch (error) {
            console.error('[enterChatValue] Error: ', error);
        }
    }

    // -v- 點選 Sider 事件
    const chooseDiffAccidentDetails = (_id: string) => {
        API_fetchAccidentDetailsContent(_id);
    }

    // -v- 加入聊天內容
    const enterChatValue = () => {

        try {
            setUserDescription("");

            // @ 取得台灣的即時時間
            const taiwanTime = getTaiwanTime();
            const createTime = toHumanReadable(taiwanTime);

            // @ 使用者的新對話內容
            const userNewChat: ChatContentType = {
                value: userDescription,
                character: "questioner",
                createTime: createTime
            };

            const chatBotLoading: ChatContentType = {
                value: <div className="loader" style={{fontSize: "15px"}} ></div>,
                character: "chatBot",
                createTime: createTime
            }

            // @ 更新畫面 & API 呼叫
            API_retrievalContent([...currentAccidentDetails.historyChatContent, userNewChat], currentAccidentDetails.historyChatContent.length == 0);
            setCurrentAccidentDetails(prevState => ({
                ...prevState,
                historyChatContent: [...prevState.historyChatContent, userNewChat, chatBotLoading]
            }));     
        }
        catch (error) { }
    }

    // -v- 聊天內容輸出
    const RenderDisplayChatContent = () => {
        const renderList: JSX.Element[] = [];
        currentAccidentDetails.historyChatContent.map((item, index) => {
            return renderList.push(
                <SpeechBubbles 
                    key={index}
                    character={item.character} 
                    value={item.value}
                    createTime={item.createTime} />
            )
        })

        return renderList;
    };

    // -v- 開關事實生成框
    const changeGenerateFact_divSize = () => {
        setColSizeListDict(prevState => ({
            ...prevState,
            rightPanel_divSize: prevState.rightPanel_divSize == 9 ? 0 : 9
        }))
    }

    // -v- 登出
    const logOut = () => {
        localStorage.removeItem('verificationCode');
        Cookies.remove('verificationCode');

        router.push('/');
    }

    // => 初始化讀取
    useEffect(() => {
        API_fetchAccidentDetailsTitle(); // = 獲得標題
    }, [])


    // ---------------------------------------- Return ----------------------------------------
    return (<> 
    <Layout>
        {/* flex flex-wrap min-h-screen */}
        <Sider width="5%" className='' style={{ background: "#9c9c9c37" }} collapsed={true}>

            <Menu
                style={{background: "transparent"}}
                mode="inline"
                items={titlesSider}
                onClick={(e) => { chooseDiffAccidentDetails(e.key) }}
            />
            
            <div className='justify-center flex'>
                <Button 
                    className='absolute bottom-2 bg-transparent rounded-full border-2 border-slate-600 text-xl min-w-10'
                    onPress={logOut}> 
                    <PoweroffOutlined />
                </Button>
            </div>

        </Sider>
        <Content className='flex flex-wrap min-h-screen'>
            
            {/*  */}

            {/* 對話框 */}
            <Col xl={24-colSizeDict.rightPanel_divSize} lg={24-colSizeDict.rightPanel_divSize} md={24} sm={24} xs={24} >
                <div className='grid content-between shrink w-full h-full'>

                    {/* 對話內容 */}
                    <div className="pt-8 pl-20 pr-20 overflow-y-scroll no-scrollbar" style={{height: "80vh"}} id="div-chat-view-container">
                        <Card style={{height: "95%"}}>

                            {/* 對話初始提示框 */}
                            {currentAccidentDetails.historyChatContent.length == 0 && 
                                <div className="pt-8 pl-20 pr-20" id="div-chat-init-hint-container">      
                                    <Card>
                                        <CardHeader className="flex gap-3">
                                            <Image 
                                                alt="ccg-icon" 
                                                src="/ccg_icon.png" 
                                                width="64" height="64" sizes="100vw"  
                                                priority={true} />
                                            <p>
                                                你好，歡迎來到 CCG，我是你的法律法遵機器人。請問有什麼我可以幫你的嗎？ <br />
                                                以下是一些詢問範例
                                            </p>
                                        </CardHeader>

                                        <Divider/>

                                        <CardBody>
                                            <p>描述車禍當時的情況...</p>
                                        </CardBody>
                                    </Card>
                                </div>  
                            }

                            <RenderDisplayChatContent />
                        </Card>
                    </div>

                    {/* 輸入 */}
                    <div className="flex gap-4 p-7" id="div-chat-input-container">
                        <Textarea 
                            className='h-full bg-white'
                            label="想輸入的內容...."
                            variant={"faded"}
                            value={userDescription}
                            onValueChange={setUserDescription} />
                        <Button 
                            className='h-full w-12 bg-white' variant="faded" 
                            onPress={enterChatValue}
                            isIconOnly > 
                            <ArrowRightOutlined /> 
                        </Button>
                    </div>
                </div>

                {/* 事實生成框大小調整 */}
                <Button 
                    color={"default"}
                    size="sm" 
                    variant= { colSizeDict.rightPanel_divSize == 0 ? "solid" : "ghost"}
                    className='lg:absolute lg:right-0 lg:inset-y-1/2 lg:z-10 lg:min-w-4 lg:min-h-20 hidden lg:block'
                    onPress={changeGenerateFact_divSize} >
                    {colSizeDict.rightPanel_divSize == 0 ? String.fromCharCode(8592) : String.fromCharCode(8594)}                    
                </Button>
            </Col>

            {/* 事實生成框 rightPanel*/}
            <Col xl={colSizeDict.rightPanel_divSize} lg={colSizeDict.rightPanel_divSize} md={24} sm={24} xs={24} >
                <Divider />
                <div className='w-full h-full p-10 overflow-y-scroll no-scrollbar'>

                    <Tabs 
                        aria-label='Options'
                        selectedKey={rightPanelSelect}
                        onSelectionChange={(key) => setRightPanelSelect(String(key))} >
                        
                        <Tab key="事實生成" title="事實生成">
                            <Card style={{height: "83vh"}}>
                                <CardHeader className="flex gap-3">
                                    <p className="text-md">事實生成</p>
                                    <p className="text-small text-default-500">經過模組還原的事實</p>
                                </CardHeader>
                                <Divider/>


                            </Card>
                        </Tab>

                        <Tab key="事件細節" title="事件細節">
                            <Card style={{height: "83vh"}}>

                                <CardHeader className="flex gap-3">
                                    <p className="text-md">事件細節</p>
                                    <p className="text-small text-default-500">條列式事件細節</p>
                                </CardHeader>
                                <Divider/>

                                <AccidentDetailJson 
                                    accidentDetails={currentAccidentDetails}/>
                            </Card>
                        </Tab>

                    </Tabs>
                </div>
            </Col>

            
        </Content>
    </Layout> 
    </>)
}

