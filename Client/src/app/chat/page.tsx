"use client";

import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

export default function Chat() {

    // ---------------------------------------- Variables ----------------------------------------
    const [chatInputText, setChatInputText] = useState<string>('');

    return (<>

        {/* 選擇對話紀錄框 */}
        <div></div>

        <div className='flex min-h-screen '>

            {/* 對話框 */}
            <div className='grow bg-slate-300 justify-center grid content-between'>
                <div className="max-w-xl pt-8">      
                    <Card title="歡迎您使用 CCG 系統 !">
                        <p>CCG的目的在於為您建立車禍事實經過，預測民事判決金額...</p>
                        <p>= 民國... </p>
                        <p>= 民國... </p>
                        <p>= 民國... </p>
                    </Card>

                </div>  

                <div className="max-w-xl h-20 pb-8 grid grid-cols-5 gap-4">
                    <InputText className='h-full col-span-4' value={chatInputText} onChange={(e) => setChatInputText(e.target.value)} />
                    <Button className='h-full col-span-1' label="Submit" />
                </div>

            </div>

            {/* 事實生成框 */}
            <div className='grow-0 w-2/5 bg-stone-300'></div>

        </div>

    </>)
}