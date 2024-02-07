import { useState, useEffect } from "react";

// - NextUI
import {Button, Input, Divider} from "@nextui-org/react";

// : Data Template
import { AccidentDetailsType} from 'data/accidentDetails';


const AccidentDetailJson = ({accidentDetails}: {accidentDetails: AccidentDetailsType}) => {
    
    // ---------------------------------------- Variables ----------------------------------------
    const [accidentDetailsTypes, setAccidentDetailsTypes] = useState<string[]>([]); // = AccidentDetails 類別
    const [currentChooseType, setCurrentChooseType] = useState<string>(""); // = 目前選擇的 AccidentDetails 類別

    const [currentPage, setCurrentPage] = useState<string>(""); // = 目前頁數 (選擇類別，查看細項)

    // -v- 顯示類型板塊
    const RenderDisplayAccidentDetailsType = () => {
        const renderList: JSX.Element[] = [];
        accidentDetailsTypes.map((item: string, index: number) => {
            return renderList.push(
                <Button 
                    key={"AccidentDetailsType-" + index}
                    className={`h-16 text-2xl shadow-lg ${item != currentChooseType ? "bg-gradient-to-tr text-black from-zinc-200 to-zinc-50" : "bg-gradient-to-tr text-black from-blue-200 to-blue-50"}`}
                    onPress={(e) => {setCurrentChooseType(item)}}> {item}
                </Button>
            )
        })

        return renderList;
    }
    // => 監控 AccidentDetails 更新類別
    useEffect(() => {
        const currentAccidentDetailsType = Object.keys(accidentDetails.incidentJson);
        setAccidentDetailsTypes(currentAccidentDetailsType);
        setCurrentChooseType(currentAccidentDetailsType[0])
    }, [accidentDetails]);


    // -v- 顯示細項板塊
    const RenderDisplayAccidentDetailsIncidentJson = () => {
        const renderList: JSX.Element[] = [];
        if (accidentDetails.incidentJson && accidentDetails.incidentJson[currentChooseType]) {
            Object.keys(accidentDetails.incidentJson[currentChooseType]).map((key: string, index: number) => {
                return renderList.push(
                    <Input 
                        key={"RenderDisplayAccidentDetailsIncidentJson-" +index}
                        label={key}
                        labelPlacement={"outside"}
                        value={accidentDetails.incidentJson[currentChooseType][key]} />
                )
            });
        }
        return renderList
    }

    return (<>

        {/* 選擇類型大塊 */}
        <div className="grid grid-cols-2 gap-4 p-5 w-full">
            <RenderDisplayAccidentDetailsType />
        </div>  

        <Divider />

        {/* 列表 */}
        <div className="grid p-5 pt-1 w-full gap-y-4 overflow-y-scroll no-scrollbar">
            <RenderDisplayAccidentDetailsIncidentJson />
        </div>


    </>);
};

export default AccidentDetailJson;