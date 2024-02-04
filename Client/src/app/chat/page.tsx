"use client";

import React, { useState } from 'react';
import Image from 'next/image';

import {
    Col,
    Row,
    Layout,
    Menu
} from 'antd';
const { Sider, Content } = Layout;

import {
    Card, CardHeader, CardBody, CardFooter, 
    Divider, 
    Input, Button
} from "@nextui-org/react";

import {
    ArrowRightOutlined
} from '@ant-design/icons';


export default function Chat() {

    // ---------------------------------------- Variables ----------------------------------------
    // : 畫面
    const [colSizeDict, setColSizeListDict] = useState({generateFact_divSize: 9})
    
    // : 聊天內容
    const [chatInputText, setChatInputText] = useState<string>('');
    const [sideBarCollapsed, setSideBarCollapsed] = useState(false);                  // = 聊天 Sidebar
    return (<>
    <Layout>
        
        <Sider width="5%"  style={{ background: "transparent" }} collapsed={true}>
            
        </Sider>
        
        <Content>
            <div className='flex min-h-screen'>

            {/* 對話框 */}
            <Col xl={24} lg={24} md={24} sm={24} xs={24} className='bg-slate-400'>
                <div className='grid content-between bg-slate-400 shrink w-full h-full'>

                    {/* 對話初始提示框 */}
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

                    {/* 對話內容 */}
                    <div id="div-chat-view-container">

                    </div>


                    {/* 輸入 */}
                    <div className="flex gap-4 p-7" id="div-chat-input-container">
                        <Input className='h-full' type="email" label="聊天內容" />
                        <Button className='h-full w-12' isIconOnly variant="faded" aria-label="Take a photo"> <ArrowRightOutlined /> </Button>
                    </div>

                </div>
            </Col>

            {/* <Button isIconOnly> </Button> */}

            {/* 事實生成框 */}
            {/* <Col xl={colSizeDict.generateFact_divSize} lg={colSizeDict.generateFact_divSize} md={24} sm={24} xs={24} >
                <div className='bg-stone-300'></div>
            </Col> */}

            </div> 
        </Content>
    </Layout>
    </>)
}