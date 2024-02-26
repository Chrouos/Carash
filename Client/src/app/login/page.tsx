
"use client"
import Cookies from 'js-cookie'
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
import authHeader from '../../Provider/store/AuthHeader';
import { useMessageContext } from '../../Provider/context/MessageContext'; 

import { EyeFilledIcon } from 'components/EyeFilledIcon';
import { EyeSlashFilledIcon } from 'components/EyeSlashFilledIcon';

export default function Login() {

    const { messageApi } = useMessageContext();
    const router = useRouter()

    const [account, setAccount] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    // ----- 獲得聊天記錄的標題
    const loginAccount = async () => {
        const request = {
            account, 
            password
        };

        try {
            const response = await axios.post('/api/users/loginAccount', request, { headers: authHeader() });

            if (response.data.isSuccesses) {
                messageApi.success(response.data.message);

                localStorage.setItem('verificationCode', response.data.verificationCode);
                Cookies.set('verificationCode', response.data.verificationCode, { expires: 2 }); // cookie有效期2天

                router.push('/chat');
            } else {
                messageApi.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // -v- 換頁
    const changePageToRegister = () => {
        router.push('/register');
    }

    // => 偵測Enter
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            loginAccount();
        }
    };

    return (<>
        <div className="h-screen grid place-content-center">

            <Card className="login-card">
                
                <div className="w-full grid place-content-center p-9">
                    <Image alt="ccg-icon" src="/ccg_icon.png" width="150" height="200" sizes="100vw" className="w-15 h-auto" priority={true} />
                </div>

                <div className="w-full flex flex-col items-center gap-5">
                    <Input 
                        className="login-input" 
                        label="Account"
                        variant="bordered"
                        value={account}
                        onValueChange={setAccount}
                        onKeyDown={handleKeyDown} />
                    <Input 
                        className="login-input" 
                        label="Password"
                        variant="bordered"
                        value={password}
                        endContent={
                            <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                {isVisible ? (
                                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                ) : (
                                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                )}
                            </button>
                        }
                        type={isVisible ? "text" : "password"}
                        onValueChange={setPassword}
                        onKeyDown={handleKeyDown} />

                    <div className="gap-5 flex">
                        <Button 
                            className="login-button"
                            onPress={changePageToRegister}>
                            Register
                        </Button>

                        <Button 
                            className="login-button" 
                            onPress={loginAccount} 
                            isDisabled={account == "" || password == "" }> 
                            Submit
                        </Button>
                    </div>
                </div>

            </Card>

        </div>

    </>)

}