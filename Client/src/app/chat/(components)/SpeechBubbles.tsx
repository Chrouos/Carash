import styled from 'styled-components';
import React from 'react';

import {
    Avatar
} from "@nextui-org/react";

// 定義對話框容器的屬性類型
interface ChatBoxContainerProps {
    $character: 'questioner' | 'chatBot';
}

// 定義對話泡泡的屬性類型
interface SpeechBubblesProps {
    character: 'questioner' | 'chatBot';
    value: string;
    createTime: string
}

// 對話框容器的樣式組件
const SpeechBubblesContainer = styled.div<ChatBoxContainerProps>`
    display: flex;
    justify-content: ${(props) => (props.$character === 'questioner' ? 'flex-end' : 'flex-start')};
    padding: 9px 40px;
`;

// 對話泡泡和頭像的容器
const SpeechBubbleAndAvatar = styled.div<ChatBoxContainerProps>`
    
    display: flex;
    flex-direction: ${(props) => (props.$character === 'questioner' ? 'row-reverse' : 'row')};
    align-items: center;
    gap: 22px;
`;

// 對話泡泡的樣式組件
const SpeechBubblesValues = styled.p<ChatBoxContainerProps>`
    background: ${(props) => (props.$character === 'questioner' ? 'antiquewhite' : 'aliceblue')};
    max-width: 70%;
    width: fit-content;
    padding: 10px;
    word-wrap: break-word;
    border-radius: 12px;
    font-size: 16px;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        ${(props) =>
            props.$character === 'questioner'
            ? `
                right: -10px;
                border-top: 10px solid transparent;
                border-bottom: 10px solid transparent;
                border-left: 10px solid antiquewhite;`
            : `
                left: -10px;
                border-top: 10px solid transparent;
                border-bottom: 10px solid transparent;
                border-right: 10px solid aliceblue;`}
        top: calc(50% - 10px);
    }
`;

// 對話泡泡組件
const SpeechBubbles = ({ character, value, createTime }: SpeechBubblesProps) => {

    const avatarImg = character == "questioner" ? "./user_icon.png" : "./ccg_icon.png"
    
    return (
        <SpeechBubblesContainer $character={character}>
            <SpeechBubbleAndAvatar $character={character}>
                <Avatar style={{backgroundColor: "white"}} isBordered radius="full" src={avatarImg} />
                <SpeechBubblesValues $character={character}>
                    {value}
                </SpeechBubblesValues>
            </SpeechBubbleAndAvatar>
        </SpeechBubblesContainer>
    );
};

export default SpeechBubbles;