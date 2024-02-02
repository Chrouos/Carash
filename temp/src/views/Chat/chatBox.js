import styled from 'styled-components';
import React from "react";

const ChatBoxContainer = styled.div`
    display: flex;
    justify-content: ${(props) => props.character === 'questioner' ? 'flex-end' : 'flex-start'}; 
    padding: 0 13px;
`

const ChatBoxBubble = styled.p`
    background: ${(props) => props.character === 'questioner' ? 'antiquewhite' : 'aliceblue'};
    max-width: 70%;
    width: fit-content;
    padding: 10px;
    word-wrap: break-word;
    border-radius: 12px;
    font-size: 16px;
`

const ChatBox = (props) => {
    // justifyContent: 'questioner' or 'chatBot'
    const character = props.character;
    const value = props.value;

    return (
        <ChatBoxContainer character={character}>
            <ChatBoxBubble character={character}>{value}</ChatBoxBubble>
        </ChatBoxContainer>
    )

}

export default ChatBox;
