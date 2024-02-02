"use client";

import React, { useState } from 'react';
import { Card } from 'primereact/card';

export default function Chat() {
    return (<>

        {/* 選擇對話紀錄框 */}
        <div></div>

        <div className='flex min-h-screen '>

            {/* 對話框 */}
            <div className='grow bg-slate-300 flex justify-center'>     
                <div className="w-full max-w-xl pt-8">      
                    <Card title="歡迎您使用 CCG 系統 !">
                        <p>CCG的目的在於為您建立車禍事實經過，預測民事判決金額...</p>
                        <p>= 民國... </p>
                        <p>= 民國... </p>
                        <p>= 民國... </p>
                    </Card>
                </div>  
            </div>

            {/* 事實生成框 */}
            <div className='grow-0 w-2/5 bg-stone-300'></div>

        </div>

    </>)
}