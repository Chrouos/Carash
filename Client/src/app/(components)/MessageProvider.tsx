// MessageProvider.tsx
"use client";

import React, { ReactNode } from 'react';
import MessageContext from './(context)/MessageContext'; // 確保路徑正確
import { message } from 'antd';

interface MessageProviderProps {
    children: ReactNode; // 這裡定義 children 屬性
}

const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
    const [messageApi, contextHolder] = message.useMessage();

    return (
        <MessageContext.Provider value={{ messageApi }}>
            {contextHolder}
            {children}
        </MessageContext.Provider>
    );
};

export default MessageProvider;
