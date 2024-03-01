import React, { useState } from "react";

import { 
    AiOutlineExclamation, AiOutlineFile, AiOutlineMore, AiOutlineLike, 
    AiOutlineArrowRight, AiOutlinePoweroff 
} from "react-icons/ai";
import { IconType } from "react-icons";


import { Select, SelectItem } from "@nextui-org/react";

// 定義一個映射物件的類型，其中的鍵是字符串，值是 IconType
interface IconMap {
    [key: string]: IconType;
}

interface ReturnIconProps {
    IconName?: keyof IconMap; // 將 IconName 的類型定義為 IconMap 的鍵的聯合類型
}

const iconMap: IconMap = {
    Exclamation: AiOutlineExclamation,
    More: AiOutlineMore,
    Like: AiOutlineLike,
    File: AiOutlineFile, 
    ArrowRight:AiOutlineArrowRight,
    PowerOff: AiOutlinePoweroff
};
const iconKeys = Object.keys(iconMap);
const iconLabelValuePairs = iconKeys.map(key => ({ label: key, value: iconMap[key] }));

const ReturnIcon: React.FC<ReturnIconProps> = ({ IconName = "File" }) => {
    const IconComponent = iconMap[IconName] || AiOutlineFile;
    return <IconComponent />;
};

interface IconSelectorProps {
    className?: string; // 可選，用於自定義 CSS 類名
    currentValue?: string; // 當前選擇的圖標名稱，可選
    selectionChangeIcon: (iconName: string) => void; // 當圖標選擇發生變化時的回調函數
}

const IconSelector: React.FC<IconSelectorProps> = ({ className = "", currentValue = "File", selectionChangeIcon}) => {

    const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        selectionChangeIcon(selectedValue);
    };

    return (<>
        <Select
            label="Choose an Icon"
            placeholder="Select an icon"
            className=" max-w-full"
            startContent={currentValue ? <ReturnIcon IconName={currentValue} /> : ""}
            selectedKeys={[currentValue]}
            onChange={handleSelectionChange}
        >
            {iconKeys.map((key) => (
                <SelectItem key={key} value={key}>{key}</SelectItem>
            ))}
        </Select>
    </>);
};

export { IconSelector, ReturnIcon };
