"use client";

// - System Preferences
import React, { ContextType, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

// - Antd
import {
    Col,
    Menu,
    Layout
} from 'antd';
const { Sider, Content } = Layout;

// - Antd Icon
import { ArrowRightOutlined, FileOutlined, PoweroffOutlined, CaretRightOutlined, PauseOutlined } from '@ant-design/icons';
// - NextUI
import {
    Card, CardHeader, CardBody, CardFooter, 
    Divider, 
    Input, Button,
    Textarea, 
    Tabs, Tab,
    Listbox, ListboxItem
} from "@nextui-org/react";

// - 自己寫的元件
import SpeechBubbles from './(components)/SpeechBubbles';
import AccidentDetailJson from './(components)/AccidentDetailJson';
import MenuSider from './(components)/MenuSider';

import "../../styles/loading.css"

import { getTaiwanTime, toHumanReadable } from 'utils/TimeTw';
import axios from '../../utils/Axios';
import authHeader from '../../Provider/store/AuthHeader';

// - Date Template
import { accidentDetails, AccidentDetailsType, ChatContentType} from 'data/accidentDetails';
import {ReturnIcon, IconSelector} from 'components/ReturnIcon';
import { useMessageContext } from '../../Provider/context/MessageContext'; 

export default function Chat() {

    // ---------------------------------------- Variables ----------------------------------------
    const router = useRouter()
    const { messageApi } = useMessageContext();

    // : Loading
    const [isLoading, setIsLoading] = useState(false);
    const [loadingStates, setLoadingStates] = useState({
        API_retrievalContent: false,
        API_fetchAccidentDetailsTitle: false,
        API_fetchAccidentDetailsContent: false,
        API_refactorEvent: false,
        API_fatchRandomJudgment: false
    }); // = 儲存各個API的loading狀態
    useEffect(() => {  
        // @ 當任何一個API的loading狀態改變時，更新isLoading
        const anyLoading = Object.values(loadingStates).some(state => state);
        setIsLoading(anyLoading);

    }, [loadingStates]);

    // : 畫面
    const [colSizeDict, setColSizeListDict] = useState({rightPanel_divSize: 0})
    
    // : 選單
    const [titlesSider, setTitlesSider] = useState<{ key: string, label: string, icon: JSX.Element }[]>([]); // = 對話歷史紀錄（所有標題）

    // : 聊天內容
    const [userDescription, setUserDescription] = useState<string>(''); // = 使用者當前輸入的內容
    const [ccgCurrentQuestion, setCCGCurrentQuestion] = useState<string>("車禍發生事故"); // = CCG 當前的問題
    const [currentAccidentDetails, setCurrentAccidentDetails] = useState<AccidentDetailsType>(accidentDetails); // = 當前車禍資料內容
    const [ccgLastQuestionKey, setCCGLastQuestionKey] = useState<string>(""); // = CCG 提出的上一個問題
    const [twiceFlag, setTwiceFlag] = useState<Boolean>(false); // = CCG 提出相同問題的二次機會

    const historyChatContentRef = useRef<HTMLDivElement>(null); // = 對話內容的 REF

    // : 參考判決書
    const [selectJudgment, setSelectJudgment] = useState<string>(''); // = 參考判決書
    const [selectJudgmentID, setSelectJudgmentID] = useState<number>(0); // = 參考判決書ID

    // : 生成視窗框
    const [rightPanelSelect, setRightPanelSelect] = useState<string>("事件細節"); // = 目前選擇的 rightPanel
    const [currentChooseType, setCurrentChooseType] = useState<string>(""); // = 目前選擇的 AccidentDetails 類別

    // : 自動對話
    const [isAutoConversation, setIsAutoConversation] = useState<boolean>(false); // = 是否自動對話中
    
    // ---------------------------------------- API ----------------------------------------

    // ----- 輸入對話內容
    const API_retrievalContent = async (new_historyChatContent: ChatContentType[], isNewConversation: boolean, newDescription: string) => {

        const request = {
            userDescription: newDescription,
            verificationCode: localStorage.getItem("verificationCode")|| "",
            ccgCurrentQuestion: ccgCurrentQuestion,
            incidentJson: currentAccidentDetails.incidentJson,
            title: currentAccidentDetails.title,
            _id: currentAccidentDetails._id,
            historyChatContent: new_historyChatContent,
            currentChooseType: currentChooseType,
            refactorHappened: currentAccidentDetails.refactorHappened,
            iconName: currentAccidentDetails.iconName,
            twiceFlag: twiceFlag,
            ccgLastQuestionKey: ccgLastQuestionKey

        }

        try {
            setLoadingStates(prev => ({ ...prev, API_retrievalContent: true }));
            const response = await axios.post('/api/accidentDetails/retrievalContent', request, { headers: authHeader() });

            // @ 增加對話
            setCurrentAccidentDetails(prevState => ({
                // ...prevState,
                incidentJson: response.data.incidentJson,
                historyChatContent: response.data.historyChatContent,
                title: response.data.title,
                _id: response.data._id,
                refactorHappened: response.data.refactorHappened,
                iconName: response.data.iconName
            }));   

            // @ 刷新 titleSlider
            if (isNewConversation) { API_fetchAccidentDetailsTitle(); }
            
            // @ 更新當前問題   
            setCCGCurrentQuestion(response.data.ccgCurrentQuestion);
            // @ 更新上一個問題   
            setCCGLastQuestionKey(response.data.ccgLastQuestionKey);
            // @ 更新二次機會狀態
            setTwiceFlag(response.data.twiceFlag);

        } catch (error) {
            console.error('[API_retrievalContent] Error: ', error);
        } finally {
            setLoadingStates(prev => ({ ...prev, API_retrievalContent: false }));
        }
    }

    // ----- 獲得資料標題
    const API_fetchAccidentDetailsTitle = async () => {

        const request = {
            verificationCode: localStorage.getItem("verificationCode") || "",
        }

        try {

            setLoadingStates(prev => ({ ...prev, API_fetchAccidentDetailsTitle: true }));

            const response = await axios.post('/api/accidentDetails/getAccidentDetailsTitle', request, { headers: authHeader() });
            const newTitleSider = response.data.titles.map((item: {_id: string, title: string, iconName: string}, index: number) => {       
                return {
                    key: item._id,
                    label: item.title,
                    icon: <ReturnIcon IconName={item.iconName} />
                }
            })
            setTitlesSider(newTitleSider);

        } catch (error) {
            console.error('[API_fetchAccidentDetailsTitle] Error: ', error);
        } finally {
            setLoadingStates(prev => ({ ...prev, API_fetchAccidentDetailsTitle: false }));
        }
    }

    // ----- 從 Sider 選擇標題後得到內容
    const API_fetchAccidentDetailsContent = async (_id: string) => {
        
        const request = { 
            _id: _id || currentAccidentDetails._id,
        }

        try {

            setLoadingStates(prev => ({ ...prev, API_fetchAccidentDetailsContent: true }));

            const response = await axios.post('/api/accidentDetails/getContentAndJson', request, { headers: authHeader() });
            setCurrentAccidentDetails(prevState => ({
                // ...prevState,
                incidentJson: response.data.incidentJson,
                historyChatContent: response.data.historyChatContent,
                title: response.data.title,
                _id: response.data._id,
                refactorHappened: response.data.refactorHappened,
                iconName: response.data.iconName
            }));   
            setCCGCurrentQuestion(response.data.historyChatContent[response.data.historyChatContent.length - 1].value)

        } catch (error) {
            console.error('[enterChatValue] Error: ', error);
        } finally {
            setLoadingStates(prev => ({ ...prev, API_fetchAccidentDetailsContent: false }));
        }
    }

    // ----- 從 Json 中還原事實經過
    const API_refactorEvent = async (_id: string) => {
        const request = { 
            _id: _id || currentAccidentDetails._id,
            incidentJson: currentAccidentDetails.incidentJson
        }

        try {
            setLoadingStates(prev => ({ ...prev, API_refactorEvent: true }));

            const response = await axios.post('/api/accidentDetails/refactorEvent', request, { headers: authHeader() });
            setCurrentAccidentDetails(prevState => ({
                ...prevState,
                refactorHappened: response.data.refactorHappened
            }));   

        } catch (error) {
            console.error('[API_refactorEvent] Error: ', error);
        } finally {
            setLoadingStates(prev => ({ ...prev, API_refactorEvent: false }));
        }
    }

    // ----- 當事人 Agent
    const API_litigantAgent = async () => {
        const request = { 
            selectJudgment: selectJudgment,
            question: ccgCurrentQuestion || "請主要描述車禍當時的情況"
        }

        try {
            setLoadingStates(prev => ({ ...prev, API_litigantAgent: true }));

            const response = await axios.post('/api/accidentDetails/litigantAgent', request, { headers: authHeader() });
            return response.data;

        } catch (error) {
            console.error('[API_litigantAgent] Error: ', error);
        } finally {
            setLoadingStates(prev => ({ ...prev, API_litigantAgent: false }));
        }
    }

    // ----- 更新除了對話的資料
    const API_updateViewerData = async () => {
        const request = { 
            _id: currentAccidentDetails._id,
            title: currentAccidentDetails.title,
            iconName: currentAccidentDetails.iconName
        }

        try {
            setLoadingStates(prev => ({ ...prev, API_updateViewerData: true }));

            const response = await axios.post('/api/accidentDetails/updateViewerData', request, { headers: authHeader() });

            // @ 更新左邊 Sider 的資料（無串接API, 單純更新畫面）
            const updateTitlesSider = (request: {_id:string, title:string, iconName: string}) => {
                const updatedTitles = titlesSider.map((item) => {
                    if (item.key === request._id) {
                        return {
                            ...item,
                            label: request.title, // 更新 label
                            icon: {
                                ...item.icon, // 保留 icon 內其他屬性不變
                                props: { ...item.icon.props, IconName: request.iconName } // 更新 IconName
                            }
                        };
                    }
                    return item;
                });
                setTitlesSider(updatedTitles);
            };
            updateTitlesSider(request);

        } catch (error) {
            console.error('[API_updateViewerData] Error: ', error);
        } finally {
            setLoadingStates(prev => ({ ...prev, API_updateViewerData: false }));
        }
    }

    // ----- 刪除聊天記錄
    const API_deleteAccidentDetails = async () => {
        const request = { 
            _id: currentAccidentDetails._id,
        }

        try {
            const deleteTitleById = (id: string) => {
                setTitlesSider(titlesSider.filter(item => item.key !== id));
            };
            setLoadingStates(prev => ({ ...prev, API_deleteAccidentDetails: true }));

            const response = await axios.post('/api/accidentDetails/deleteAccidentDetails', request, { headers: authHeader() });

            deleteTitleById(request._id);
            createNewConversation();
            messageApi.success(response.data.message);

        } catch (error) {
            console.error('[API_deleteAccidentDetails] Error: ', error);
        } finally {
            setLoadingStates(prev => ({ ...prev, API_deleteAccidentDetails: false }));
        }
    }

    // ----- 隨機取得參考判決書
    const API_fatchRandomJudgment = async () => {
        const request = {
            selectJudgment: selectJudgment,
            selectJudgmentID: selectJudgmentID
        }

        try {
            setLoadingStates(prev => ({ ...prev, API_fatchRandomJudgment: true }));
            
            const response = await axios.post('/api/accidentDetails/getRandomJudgment', request, { headers: authHeader() });
            setSelectJudgment(response.data.selectJudgment);
            setSelectJudgmentID(response.data.selectJudgmentID);

        } catch (error) {
            console.error('[API_fatchRandomJudgment] Error: ', error);
        } finally {
            setLoadingStates(prev => ({ ...prev, API_fatchRandomJudgment: false }));
        }
    }

    // 儲存編輯後的Json
    const saveUpdatedDetails = async (updatedDetails: AccidentDetailsType) => {
        const request = {
            updatedDetails: updatedDetails
        }

        try {
            const response = await axios.post('/api/accidentDetails/saveUpdatedDetails', request, {headers: authHeader()});
            // 更新狀態
            setCurrentAccidentDetails(response.data.updatedDetails);
            console.log('Details saved successfully');
            
        } catch (error) {
            console.error('Error saving details:', error);
        }
    };

    // -v- 更新資料
    const updateViewerData = () => {
        API_updateViewerData();
    }

    // -v- 刪除資料
    const deleteAccidentDetails = () => {
        API_deleteAccidentDetails();
    }

    // -v- 取得隨機判決書
    const getRandomJudgment = () => {
        API_fatchRandomJudgment();
    }

    // -v- 還原事發經過
    const refactorEvent = (_id: string) => {
        setCurrentAccidentDetails(prevState => ({
            ...prevState,
            refactorHappened: "重構還原事發經過中..."
        }));  
        API_refactorEvent(_id);
    }

    // -v- 點選 Sider 事件
    const chooseAccidentSider = (_id: string) => {
        API_fetchAccidentDetailsContent(_id);
        // createNewConversation();
    }

    // -v- 開啟新的對話
    const createNewConversation = () => {
        // @ 復原所有內容
        setCurrentAccidentDetails(accidentDetails);
        setUserDescription("");
        setCCGCurrentQuestion("請主要描述車禍當時的情況");
        setCCGLastQuestionKey("");
        setTwiceFlag(false);
        getRandomJudgment();
    }

    // -v- 加入聊天內容
    const enterChatValue = async(_userDescription: string = "") => {

        try {

            if (loadingStates.API_retrievalContent) {return;}

            const newDescription = userDescription || _userDescription
            setUserDescription("");

            // @ 取得台灣的即時時間
            const taiwanTime = getTaiwanTime();
            const createTime = toHumanReadable(taiwanTime);

            // @ 使用者的新對話內容
            const userNewChat: ChatContentType = {
                value: newDescription,
                character: "questioner",
                createTime: createTime
            };

            const chatBotLoading: ChatContentType = {
                value: <div className="loader" style={{fontSize: "15px"}} ></div>,
                character: "chatBot",
                createTime: createTime
            }

            // @ 改變目前顯示畫面
            setCurrentAccidentDetails(prevState => ({
                ...prevState,
                historyChatContent: [...prevState.historyChatContent, userNewChat, chatBotLoading]
            })); 

            // @ 更新畫面 & API 呼叫
            await API_retrievalContent(  [...currentAccidentDetails.historyChatContent], currentAccidentDetails.historyChatContent.length == 0, newDescription );
            
        }
        catch (error) { }
    }

    // -v- 更新 ICON
    const handleSelectionChangeIcon = (iconName: string) => {
        setCurrentAccidentDetails(prevState => ({ ...prevState, iconName: iconName }));
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

    // -v- 還原事實顯示框
    const RenderDisplayRefactorEvent = () => {
        if (currentAccidentDetails?.refactorHappened) {
            return currentAccidentDetails.refactorHappened.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                    {line}
                    <br />
                </React.Fragment>
            ));
        }
        return null;
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

    // -v- 自動對話
    const autoConversation = async () => {
        // 切換自動對話狀態
        setIsAutoConversation(true);

        const responseData = await API_litigantAgent();
        await enterChatValue(responseData.agentDescription)

        setTimeout(() => {
            setIsAutoConversation(false)    
        }, 1500);
        
    }

    // => 初始化讀取
    useEffect(() => {
        API_fetchAccidentDetailsTitle(); // = 獲得標題
        createNewConversation(); // 創建一個新對話
    }, [])

    // => 偵測Enter
    const handleKeyDown = (e: React.KeyboardEvent) => {
        // 按下 Shift + Enter 鍵 ， 會換行
        if (e.key === 'Enter' && e.shiftKey) {
            return;
        }

        // 確保在按下 Enter 鍵時，且用戶描述不是空的，送出聊天內容
        if (e.key === 'Enter' && userDescription.trim() !== '') {
            e.preventDefault();
            enterChatValue();
        }
        
    };

    // => 讓對話內容如果更動保持在最下面
    useEffect(() => {
        if (historyChatContentRef.current) {
            historyChatContentRef.current.scrollTop = historyChatContentRef.current.scrollHeight;
        }
    }, [currentAccidentDetails.historyChatContent]);

    // ---------------------------------------- Return ----------------------------------------
    return (<>  <Layout>

        {/* 左邊 Sider */}
        <Sider width="12%" className='max-h-screen ' style={{ background: "#9c9c9c37" }} collapsed={false}>


            {/* 全新對話 */}
            <div className='pb-5 justify-center flex'>
                <Button  
                    className='top-2 min-w-10 h-16'
                    onPress={createNewConversation}>                     
                    <Image 
                        alt="NEW Conversation" 
                        src="/ccg_icon.png" 
                        width="64" height="64" sizes="100vw"  
                        priority={true} />
                    NEW Conversation
                </Button>
            </div>

            {/* 分隔線 */}
            <Divider className='mt-2 mb-2' />

            {/* 選擇對話紀錄 */}
            <MenuSider 
                titlesSider={titlesSider} 
                chooseAccidentSider={chooseAccidentSider}
                currentKey={currentAccidentDetails._id} />

            {/* 登出 */}
            <div className='justify-center flex'>
                <Button 
                    className='absolute bottom-2 bg-transparent rounded-full border-2 border-slate-600 text-xl min-w-10'
                    onPress={logOut}> 
                    <ReturnIcon IconName={"PowerOff"} />
                </Button>
            </div>

        </Sider>
        
        {/* 右邊 Content */}
        <Content className='flex flex-wrap h-screen'>
            
            {/* 對話框 */}
            <Col xl={24-colSizeDict.rightPanel_divSize} lg={24-colSizeDict.rightPanel_divSize} md={24} sm={24} xs={24} >
                {/* 對話框 */}
                <div className='grid shrink w-full h-full'>

                    {/* 對話內容 */}
                    <div className="pt-8 pl-20 pr-20 " style={{height: "88vh"}} id="div-chat-view-container">
                        <Card style={{height: "100%"}}>

                            {/* 對話初始提示框 */}
                            {currentAccidentDetails.historyChatContent.length == 0 && 
                                <div className="pt-8 pl-20 pr-20" id="div-chat-init-hint-container">      
                                    <Card className='h-full'>
                                        <CardHeader className="flex gap-3">
                                            <Image 
                                                alt="ccg-icon" 
                                                src="/ccg_icon.png" 
                                                width="64" height="64" sizes="100vw"  
                                                priority={true} />
                                            <p>
                                                你好，我是ccg車禍事故代理人，可以協助交通警察完成車禍事故發生經過的紀錄，請描述車禍當時的情況，包含時間、地點、事故詳情...等等，以下是一些回答範例。
                                            </p>
                                        </CardHeader>

                                        <Divider/>

                                        <CardBody >
                                            <div>
                                                <p className='text-base'>&#8658; 早上十點多的時候，我騎重機在中山路附近行駛。與一台轎車發生碰撞。</p>
                                                <p className='text-base'>&#8658; 昨日下午，我騎腳踏車在人行道上面，與一輛機車發生擦撞。</p>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </div>  
                            }
                            
                            <div className='overflow-y-auto' ref={historyChatContentRef}>
                                <RenderDisplayChatContent />
                            </div>
                        </Card>
                    </div>

                    {/* 輸入 */}
                    <div className="flex gap-4 p-7" id="div-chat-input-container" style={{height: "12vh"}}>
                        <Textarea 
                            className='h-full'
                            label="想輸入的內容...."
                            variant={"faded"}
                            value={userDescription}
                            onValueChange={setUserDescription}
                            placeholder='Shift + Enter 可直接傳送'
                            onKeyDown={handleKeyDown}
                            isDisabled={isAutoConversation} />
                        <Button 
                            className='h-full w-12 bg-white' variant="faded" 
                            onPress={(e) => {enterChatValue()}}
                            isIconOnly
                            isDisabled={loadingStates.API_retrievalContent || isAutoConversation}> 
                            <ReturnIcon IconName={"ArrowRight"} /> 
                        </Button>
                    </div>
                </div>

                {/* 事實生成框大小調整按鈕 */}
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
                <div className='w-full h-screen p-10 overflow-y-scroll no-scrollbar pb-0'>
                    <Tabs aria-label='Options' selectedKey={rightPanelSelect} onSelectionChange={(key) => setRightPanelSelect(String(key))} >
                        
                        <Tab key="事實生成" title="事實生成">
                            <Card style={{height: "88vh"}}>
                                <CardHeader className="flex gap-3">
                                    <p className="text-md">事實生成</p>
                                    <p className="text-small text-default-400">經過模組還原的事實</p>
                                </CardHeader>
                                <Divider/>
                                
                                <div className='p-5 h-full'>
                                    <Textarea
                                        label="Description"
                                        variant="bordered"
                                        value={currentAccidentDetails.refactorHappened}
                                        onValueChange={(e) => {setCurrentAccidentDetails(prevState => ({...prevState, refactorHappened: e}))}}
                                        placeholder="Enter your description"
                                        classNames={{
                                            input: "resize-y min-h-[65vh]",
                                        }} />
                                </div>

                                <div className='grid grid-cols-2 gap-4 pr-4 pl-4 place-content-center h-28'>
                                    <Button 
                                        className='bg-transparent border-2 border-slate-600 text-xl '
                                        onPress={autoConversation}
                                        isLoading={isAutoConversation} > 
                                        自動回話
                                        {/* {!isAutoConversation ? <CaretRightOutlined /> : <PauseOutlined />} */}
                                        {/* <CaretRightOutlined /> */}
                                        
                                    </Button>

                                    <Button 
                                        className='text-xl'
                                        onPress={(e) => {refactorEvent(currentAccidentDetails._id)}}
                                        isLoading={ loadingStates?.API_refactorEvent }
                                        disabled={currentAccidentDetails._id == ""} >
                                        還原事實 
                                    </Button>
                                </div>


                            </Card>
                        </Tab>

                        <Tab key="事件細節" title="事件細節">
                            <Card style={{height: "88vh"}}>

                                <CardHeader className="flex gap-3">
                                    <p className="text-md">事件細節</p>
                                    <p className="text-small text-default-400">條列式事件細節</p>
                                </CardHeader>
                                <Divider/>

                                <AccidentDetailJson 
                                    accidentDetails={currentAccidentDetails}
                                    currentChooseType={currentChooseType}
                                    setCurrentChooseType={setCurrentChooseType} 
                                    onSave={saveUpdatedDetails}
                                />
                            </Card>
                        </Tab>

                        
                        <Tab key="設定" title="設定">
                            <Card style={{height: "88vh"}}>

                                <CardHeader className="flex gap-3">
                                    <p className="text-md">聊天室設定</p>
                                    <p className="text-small text-default-400">對話內容設定</p>
                                </CardHeader>
                                <Divider/>
                                
                                <div className='p-5 grid grid-cols-1 gap-6 '>
                                    <Input 
                                        variant='underlined' value={currentAccidentDetails.title} label={"Title"} 
                                        onValueChange={(e) => {setCurrentAccidentDetails(prevState => ({...prevState, title: e}))}} />
                                    <IconSelector 
                                        currentValue={currentAccidentDetails.iconName} 
                                        selectionChangeIcon={handleSelectionChangeIcon}
                                        />
                                </div>

                                <div className='gap-5 absolute bottom-0 w-full flex items-center justify-center h-20'>
                                    <Button 
                                        className='text-xl'
                                        onPress={(e) => {updateViewerData()}}
                                        isLoading={loadingStates?.API_refactorEvent}
                                        disabled={currentAccidentDetails._id == ""} 
                                        color={"success"}
                                        variant="bordered" >
                                        更新資料
                                    </Button>
                                    <Button 
                                        className='text-xl'
                                        onPress={(e) => {deleteAccidentDetails()}}
                                        isLoading={loadingStates?.API_refactorEvent}
                                        disabled={currentAccidentDetails._id == ""} 
                                        color={"danger"}
                                        variant="bordered" >
                                        刪除資料
                                    </Button>
                                </div>
                                
                            </Card>
                        </Tab>

                        <Tab key="參考判決" title="參考判決">
                            <Card style={{height: "88vh"}}>

                                <CardHeader className="flex gap-3">
                                    <p className="text-md">參考判決</p>
                                    <p className="text-small text-default-400">隨機判決書參考判決</p>
                                </CardHeader>
                                <Divider/>

                                <div className='p-5 h-full'>
                                    <Textarea
                                        label="Description"
                                        variant="bordered"
                                        value={selectJudgment}
                                        onValueChange={() => {}}
                                        placeholder="參考判決"
                                        classNames={{
                                            input: "resize-y min-h-[65vh]",
                                        }} 
                                        disabled
                                    />
                                </div>

                                <div className='grid grid-cols-2 gap-4 pr-4 pl-4 place-content-center h-28'>
                                    <Button 
                                        className='bg-transparent border-2 border-slate-600 text-xl '
                                        onPress={autoConversation}
                                        isLoading={isAutoConversation} > 
                                        自動回話
                                        {/* {!isAutoConversation ? <CaretRightOutlined /> : <PauseOutlined />} */}
                                        {/* <CaretRightOutlined /> */}
                                        
                                    </Button>

                                    <Button 
                                        className='text-xl'
                                        onPress={getRandomJudgment}
                                        isLoading={loadingStates?.API_fatchRandomJudgment}
                                         >
                                        重選參考 
                                    </Button>
                                </div>

                            </Card>
                        </Tab>


                    </Tabs>
                </div>
            </Col>

            
        </Content>

    </Layout>  </>)
}

