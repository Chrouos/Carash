"use client"

import { useState } from "react";

// - nextJs
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// - nextUI
import {Card, CardHeader, CardBody, CardFooter, Input} from "@nextui-org/react";
import Image from 'next/image';
import {Button, ButtonGroup} from "@nextui-org/react";

// - self
import "../../styles/login.css"
import axios from '../../utils/Axios';
import authHeader from '../../components/store/AuthHeader';
import { useMessageContext } from '../../components/context/MessageContext'; 

export default function Login() {

    const { messageApi } = useMessageContext();
    const router = useRouter()

    const [account, setAccount] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [nickName, setNickName] = useState<string>("");

    // ----- 獲得聊天記錄的標題
    const registerAccount = async () => {
        const request = {
            account, password, email, nickName
        }
        await axios
            .post('/users/registerAccount', request, { headers: authHeader() })
            .then(response => {
                if (response.data.isSuccesses) {
                    messageApi.success(response.data.message);
                    localStorage.setItem('user', JSON.stringify(response.data));
                    router.push('/chat');
                } else {
                    messageApi.error(response.data.message);
                }
        })
        .catch(error => console.error('Error fetching data:', error));
    }


    return (<>
        <div className="h-screen grid place-content-center">

            <Card className="login-card">
                
                <div className="w-full grid place-content-center p-9">
                    {/* <Image alt="ccg-icon" src="/ccg_icon.png" width="150" height="200" sizes="100vw" className="w-15 h-auto" priority={true} /> */}
                    <h1>註冊</h1>
                </div>

                <div className="w-full flex flex-col items-center gap-5">
                    <Input 
                        className="login-input" 
                        label="Account"
                        value={account}
                        onValueChange={setAccount} />
                    <Input 
                        className="login-input" 
                        label="Password"
                        value={password}
                        onValueChange={setPassword} />
                    <Input 
                        className="login-input" 
                        label="Email"
                        value={email}
                        onValueChange={setEmail} />
                    <Input 
                        className="login-input" 
                        label="NickName"
                        value={nickName}
                        onValueChange={setNickName} />

                    <div className="gap-5 flex">
                        <Link href="/login">
                            <Button 
                                className="login-button" > 
                                Return
                            </Button>
                        </Link>
                        <Button 
                            className="login-button" 
                            onPress={registerAccount} 
                            isDisabled={account == "" || password == "" || nickName == "" || email == "" }> 
                            Submit
                        </Button>
                    </div>
                </div>
            </Card>
        </div>

    </>)

}