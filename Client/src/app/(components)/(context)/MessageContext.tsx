"use client"
import React, { createContext, useContext } from 'react';

interface MessageContextType {
    messageApi?: any;
}

// 創建 Context
const MessageContext = createContext<MessageContextType>({});
export const useMessageContext = () => useContext(MessageContext);
export default MessageContext;
