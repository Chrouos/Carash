
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
import authHeader from '../../components/store/AuthHeader';
import { useMessageContext } from '../../components/context/MessageContext'; 

export default function Login() {

    const { messageApi } = useMessageContext();
    const router = useRouter()

    const [account, setAccount] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    
    // ----- 獲得聊天記錄的標題
    const loginAccount = async () => {
        const request = {
            account, 
            password
        };

        try {
            const response = await axios.post('/users/loginAccount', request, { headers: authHeader() });

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
                        value={account}
                        onValueChange={setAccount} />
                    <Input 
                        className="login-input" 
                        label="Password"
                        value={password}
                        onValueChange={setPassword} />

                    <div className="gap-5 flex">
                        <Button 
                            className="login-button" 
                            onPress={loginAccount} 
                            isDisabled={account == "" || password == "" }> 
                            Submit
                        </Button>
                        <Link href="/register">
                            <Button className="login-button">
                                Register
                            </Button>
                        </Link>
                    </div>
                </div>

            </Card>

        </div>

    </>)

}