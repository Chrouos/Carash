import { useState, useEffect, useCallback, useRef } from "react";

// - NextUI
import {Button, Input, Divider} from "@nextui-org/react";

// : Data Template
import { AccidentDetailsType} from 'data/accidentDetails';


interface AccidentDetailJsonProps {
    accidentDetails: AccidentDetailsType;
    currentChooseType: string;
    setCurrentChooseType: React.Dispatch<React.SetStateAction<string>>;
    onSave: (updatedDetails: AccidentDetailsType) => void;
}

const AccidentDetailJson: React.FC<AccidentDetailJsonProps> = ({ accidentDetails, currentChooseType, setCurrentChooseType, onSave }) => {

    
    // ---------------------------------------- Variables ----------------------------------------
    // const [accidentDetailsTypes, setAccidentDetailsTypes] = useState<string[]>([]); // = AccidentDetails 類別
    const [editable, setEditable] = useState(false);
    const localDetailsRef = useRef(accidentDetails);

    useEffect(() => {
        localDetailsRef.current = accidentDetails;
    }, [accidentDetails]);

    const handleInputChange = useCallback((type: string, key: string, value: string) => {
        localDetailsRef.current = {
            ...localDetailsRef.current,
            incidentJson: {
                ...localDetailsRef.current.incidentJson,
                [type]: {
                    ...localDetailsRef.current.incidentJson[type],
                    [key]: value
                }
            }
        };
    }, []);

    // -v- 顯示類型板塊
    // const RenderDisplayAccidentDetailsType = () => {
    //     const renderList: JSX.Element[] = [];
    //     Object.keys(localDetails.incidentJson).forEach((item: string, index: number) => {
    //         renderList.push(
    //             <Button
    //                 key={"AccidentDetailsType-" + index}
    //                 className={`h-16 text-2xl shadow-lg ${item !== currentChooseType ? "bg-gradient-to-tr text-black from-zinc-200 to-zinc-50" : "bg-gradient-to-tr text-black from-blue-200 to-blue-50"}`}
    //                 onPress={() => setCurrentChooseType(item)}> {item}
    //             </Button>
    //         )
    //     });
    //     return renderList;
    // }

    // => 監控 AccidentDetails 更新類別
    useEffect(() => {
        const currentAccidentDetailsType = Object.keys(accidentDetails.incidentJson);
        // setAccidentDetailsTypes(currentAccidentDetailsType);
        setCurrentChooseType(currentAccidentDetailsType[0])
    }, [accidentDetails, setCurrentChooseType]);


    // -v- 顯示細項板塊
    const RenderDisplayAccidentDetailsIncidentJson = () => {
        const renderList: JSX.Element[] = [];
        if (localDetailsRef.current.incidentJson && localDetailsRef.current.incidentJson[currentChooseType]) {
            Object.keys(localDetailsRef.current.incidentJson[currentChooseType]).map((key: string, index: number) => {
                renderList.push(
                    <Input
                        key={`RenderDisplayAccidentDetailsIncidentJson-${currentChooseType}-${index}`}
                        label={key}
                        labelPlacement={"outside"}
                        defaultValue={localDetailsRef.current.incidentJson[currentChooseType][key]}
                        onChange={(e) => handleInputChange(currentChooseType, key, e.target.value)}
                        disabled={!editable}
                    />
                );
            });
        }
        return renderList;
    };

    return (<>

        {/* 選擇類型大塊 */}
        {/* <div className="grid grid-cols-2 gap-4 p-5 w-full">
            <RenderDisplayAccidentDetailsType />
        </div>  

        <Divider /> <br /> */}

        {/* 列表 */}
        <div className="grid p-5 pt-1 w-full gap-y-4 overflow-y-scroll no-scrollbar">
            <RenderDisplayAccidentDetailsIncidentJson />
        </div>
        
        {/* {可編輯按鈕與儲存} */}
        <div className='flex justify-end p-4'>
            <Button
                className='text-xl mr-2'
                onPress={() => setEditable(!editable)}>
                {editable ? '取消編輯' : '編輯'}
            </Button>
            <Button
                className='text-xl'
                onPress={() => { onSave(localDetailsRef.current); setEditable(false); }}
                disabled={!editable}>
                儲存
            </Button>
        </div>


    </>);
};

export default AccidentDetailJson;