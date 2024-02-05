
"use client"

import { useState } from "react";
import Link from 'next/link'

import {Card, CardHeader, CardBody, CardFooter, Input} from "@nextui-org/react";
import Image from 'next/image';
import {Button, ButtonGroup} from "@nextui-org/react";

import "../../styles/login.css"
import axios from '../(components)/(utils)/Axios';
import authHeader from '../(components)/(store)/AuthHeader';


export default function Login() {

    const [account, setAccount] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    // ----- 獲得聊天記錄的標題
    const loginAccount = async () => {
        const request = {
            account, password
        }
        await axios
            .post('/users/loginAccount', request, { headers: authHeader() })
            .then(response => {
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
                        label="Password"
                        value={password}
                        onValueChange={setPassword} />
                    <Input 
                        className="login-input" 
                        label="Password"
                        value={password}
                        onValueChange={setPassword} />

                    <div className="gap-5 flex">
                        <Link href="/login">
                            <Button 
                                className="login-button" > 
                                Return
                            </Button>
                        </Link>
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