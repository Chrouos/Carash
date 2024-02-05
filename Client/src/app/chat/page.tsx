"use client";

import React, { useState } from 'react';
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
} from "@nextui-org/react";

import {
    ArrowRightOutlined
} from '@ant-design/icons';

// : 自己寫的元件
import SpeechBubbles from './(components)/SpeechBubbles';
import axios from '../(components)/(utils)/Axios';
import authHeader from '../(components)/(store)/AuthHeader';

export default function Chat() {

    // ---------------------------------------- Variables ----------------------------------------
    // : 畫面
    const [colSizeDict, setColSizeListDict] = useState({generateFact_divSize: 9})
    
    // : 聊天內容
    const [chatInputText, setChatInputText] = useState<string>(''); // = 輸入內容
    const [isChatHintOpen, setIsChatHintOpen] = useState<boolean>(false); // = 是否是初始對話（提示框）
    const [titleSider, setTitlesSider] = useState([]) // = 對話紀錄


    // ---------------------------------------- API ----------------------------------------
    
    // ----- 獲得聊天記錄的標題
    const fetchingTitle = async () => {
        const request = {}
        // await axios
        //     .get('/chatGPT/getTitle')
        //     .then(response => {
        // })
        // .catch(error => console.error('Error fetching data:', error));
    }

    fetchingTitle()

    // ---------------------------------------- Return ----------------------------------------
    return (<> <Layout>
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
            <Col xl={24} lg={24} md={24} sm={24} xs={24} className='bg-slate-400'>
                <div className='grid content-between bg-slate-400 shrink w-full h-full'>

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
                    <div className="pt-8 pl-20 pr-20 overflow-y-scroll no-scrollbar h-[80vh]" id="div-chat-view-container">
                        {/* <SpeechBubbles character={"chatBot"} value='styled-components: it looks like an unknown prop "character" is being sent through to the DOM, which will likely trigger a React console error. If you would like automatic filtering of unknown props, you can opt-into that behavior via `<StyleSheetManager shouldForwardProp={...}>` (connect an API like `@emotion/is-prop-valid`) or consider using transient props (`$` prefix for automatic filtering.)'></SpeechBubbles> */}
                    </div>

                    {/* 輸入 */}
                    <div className="flex gap-4 p-7" id="div-chat-input-container">
                        <Input className='h-full' type="email" label="想輸入的內容...." />
                        <Button className='h-full w-12' isIconOnly variant="faded" aria-label="Take a photo"> <ArrowRightOutlined /> </Button>
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