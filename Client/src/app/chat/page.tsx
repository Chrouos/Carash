"use client";

import React, { ContextType, useEffect, useState } from 'react';
import Image from 'next/image';

import {
    Col,
    Row,
    Menu,
    Layout
} from 'antd';
const { Sider, Content } = Layout;

import {
    Card, CardHeader, CardBody, CardFooter, 
    Divider, 
    Input, Button,
    Textarea
} from "@nextui-org/react";

import {
    ArrowRightOutlined
} from '@ant-design/icons';

// : 自己寫的元件
import SpeechBubbles from './(components)/SpeechBubbles';
import axios from '../(components)/(utils)/Axios';
import authHeader from '../(components)/(store)/AuthHeader';

// : Date Template
import { accidentDetails, AccidentDetailsType, ChatContentType} from 'data/accidentDetails';
import { color } from 'framer-motion';

export default function Chat() {

    // ---------------------------------------- Variables ----------------------------------------
    const localStorageUser = JSON.parse(localStorage.getItem("user") || "");

    // : 畫面
    const [colSizeDict, setColSizeListDict] = useState({generateFact_divSize: 9})
    
    // : 選單
    const [titleSider, setTitlesSider] = useState([]) // = 對話歷史紀錄（所有標題）
    const [isChatHintOpen, setIsChatHintOpen] = useState<boolean>(false); // = 是否是初始對話（提示框）

    // : 聊天內容
    const [userDescription, setUserDescription] = useState<string>(''); // = 輸入內容
    const [ccgCurrentQuestion, setCCGCurrentQuestion] = useState<string>("車禍發生事故"); // = CCG 當前的問題類型
    const [currentAccidentDetails, setCurrentAccidentDetails] = useState<AccidentDetailsType>(accidentDetails); // = 當前車禍資料內容

    
    // ---------------------------------------- API ----------------------------------------
    
    // ----- 輸入對話內容
    const API_retrievalContent = async (new_historyChatContent: ChatContentType[]) => {

        const request = {
            userDescription: userDescription,
            verificationCode: localStorageUser?.verificationCode || "",
            ccgQuestion: ccgCurrentQuestion,
            incidentJson: currentAccidentDetails.incidentJson,
            title: currentAccidentDetails.title,
            _id: currentAccidentDetails._id,
            historyChatContent: new_historyChatContent,
        }

        try {
            const response = await axios.post('/accidentDetails/retrievalContent', request, { headers: authHeader() });
            // @ 增加對話
            setCurrentAccidentDetails(prevState => ({
                ...prevState,
                incidentJson: response.data.incidentJson,
                historyChatContent: response.data.historyChatContent,
                title: response.data.title,
                _id: response.data._id
            }));   

        } catch (error) {
            console.error('[enterChatValue] Error: ', error);
        }
    }

    // -v- 加入聊天內容
    const enterChatValue = () => {

        setUserDescription("");

        // @ 取得台灣的即時時間
        const taiwanTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Taipei" });
        const createTime = new Date(taiwanTime).toISOString();

        // @ 增加對話
        const newChat: ChatContentType = {
            value: userDescription,
            character: "questioner",
            createTime: createTime
        };

        setCurrentAccidentDetails(prevState => ({
            ...prevState,
            historyChatContent: [...prevState.historyChatContent, newChat]
        }));     

        API_retrievalContent([...currentAccidentDetails.historyChatContent, newChat]);
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


    // ---------------------------------------- Return ----------------------------------------
    return (<> <Layout style={{backgroundColor: "#fffaf4"}} >
        <Sider width={200} collapsed={true} style={{overflow: 'auto', height: '100%' }}>
        {/* <Menu
            mode="inline"
            items={titlesSider}
            onClick={(e) => { fetchingContentJson(e.key) }}
        /> */}
        </Sider>

        {/* <Sider width="5%"  style={{ background: "transparent" }} collapsed={true}>
            
        </Sider> */}
        
        <Content>
            <div className='flex min-h-screen'>

            {/* 對話框 */}
            <Col xl={24} lg={24} md={24} sm={24} xs={24} >
                <div className='grid content-between shrink w-full h-full'>

                    {/* 對話初始提示框 */}
                    {isChatHintOpen && 
                        <div className="pt-8 pl-20 pr-20" id="div-chat-init-hint-container">      
                            <Card>
                                <CardHeader className="flex gap-3">
                                    <Image alt="ccg-icon" src="/ccg_icon.png" width="64" height="64" sizes="100vw" className="w-15 h-auto" priority={true} />
                                </CardHeader>

                                <Divider/>

                                <CardBody>
                                    <p>一些範例</p>
                                </CardBody>
                            </Card>
                        </div>  
                    }

                    {/* 對話內容 */}
                    <div className="pt-8 pl-20 pr-20 overflow-y-scroll no-scrollbar" style={{height: "80vh"}} id="div-chat-view-container">
                        <Card style={{height: "95%"}}>
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
            </Col>

            {/* 事實生成框 */}
            {/* <Col xl={colSizeDict.generateFact_divSize} lg={colSizeDict.generateFact_divSize} md={24} sm={24} xs={24} >
                <div className='bg-stone-300'></div>
            </Col> */}

            </div> 
        </Content>
    </Layout> </>)
}