import { useState, useEffect } from "react";

// - NextUI
import {  Listbox,  ListboxSection,  ListboxItem, Tooltip} from "@nextui-org/react";

interface MenuSiderProps {
    titlesSider: { key: string, label: string, icon: JSX.Element }[],
    chooseAccidentSider: (_id: string) => void,
    currentKey: string
}

const ListboxWrapper = ({ children }: Readonly<{ children: React.ReactNode; }>) => (
    <div 
        className=' max-h-[80vh] overflow-y-scroll no-scrollbar'
        style={{background: "transparent"}}>
        {children}
    </div>
);

const MenuSider: React.FC<MenuSiderProps> = ({ titlesSider, chooseAccidentSider, currentKey }) => {

    // -v- 左邊 Menu List
    const RenderMenuList = () => {
        const renderList: JSX.Element[] = [
        ];
        
        titlesSider.forEach((item, index) => {
            renderList.push(
                <ListboxItem 
                    key={item.key} 
                    textValue={item.label} 
                    style={{textAlign: "center", height: "55px"}} 
                    className={currentKey == item.key ? "text-danger" : ""}
                    color={currentKey == item.key ? "danger" : "default"}>
                    <Tooltip content={item.label} placement="right-start" closeDelay={100} style={{width: "20vw"}}>
                        <div style={{fontSize: "30px"}}>{item.icon}</div>
                    </Tooltip>
                </ListboxItem>
            );
        });

        return renderList
    }

    return (<>

        <ListboxWrapper>
            <Listbox aria-label="Actions" onAction={(key) => chooseAccidentSider(String(key))}>
                {RenderMenuList()}
            </Listbox>
        </ListboxWrapper>
    </>);
};

export default MenuSider;
