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
    className?: string;
}

const IconSelector: React.FC<IconSelectorProps> = ({ className = "" }) => {

    const [value, setValue] = React.useState("");

    const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setValue(e.target.value);
    };

    return (<>
        <Select
            label="Choose an Icon"
            placeholder="Select an icon"
            className="max-w-xs"
            startContent={value ? <ReturnIcon IconName={value} /> : ""}
            selectedKeys={[value]}
            onChange={handleSelectionChange}
        >
            {iconKeys.map((key) => (
                <SelectItem key={key} value={key}>{key}</SelectItem>
            ))}
        </Select>
    </>);
};

export { IconSelector, ReturnIcon };
