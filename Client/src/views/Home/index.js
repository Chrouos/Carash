import React from "react";
import { Layout, Select, Table } from "antd";
const { Content } = Layout;
const { Column } = Table;


function Home() {

  const [verdictFiles, ] = React.useState([
    {value: 1, label: '108年4月30日／重型機車／傷害逃逸／側脛骨平台開放性骨折、右側顱骨骨折併額、顳葉硬腦膜外血腫'},
    {value: 2, label: '108年7月21日／中型機車／傷害逃逸／四肢多處擦傷'},
    {value: 3, label: '109年3月14日／中型機車／過失傷害罪／左側股骨粗隆間閉鎖性骨折'},
    {value: 4, label: '109年1月20日／小客車／過失傷害罪／雙手挫傷、腦震盪'},
    {value: 5, label: '109年9月08日／小客車／過失傷害罪／四肢多處擦傷'}
  ])

  const [verdictTableValues, ] = React.useState([
    {key: 1, time: '108年4月30日', car: '重型機車', crime: '傷害逃逸', injury: '側脛骨平台開放性骨折、右側顱骨骨折併額、顳葉硬腦膜外血腫', tags:['tags1', 'tags2']},
    {key: 2, time: '108年7月21日', car: '中型機車', crime: '傷害逃逸', injury: '四肢多處擦傷', tags:['']},
    {key: 3, time: '109年3月14日', car: '中型機車', crime: '過失傷害罪', injury: '左側股骨粗隆間閉鎖性骨折', tags:['']},
    {key: 4, time: '109年1月20日', car: '小客車', crime: '過失傷害罪', injury: '雙手挫傷、腦震盪', tags:['']},
    {key: 5, time: '109年9月08日', car: '小客車', crime: '過失傷害罪', injury: '四肢多處擦傷', tags:['']},
  ])


  return (
    <Content style={{ padding: '5%', height: '100%' }}>

      <div>
        <Select 
          showSearch
          style={{width: '100%'}}
          placeholder="search to select what you are looking for"
          options={verdictFiles}
          filterOption={(input, option) => (option?.label ?? '').includes(input)}
          >

        </Select>
      </div>

      <div style={{padding: '3% 0 0 0 '}}>
        <Table style={{width: '100%'}} dataSource={verdictTableValues} >
          <Column title="Time" dataIndex="time" key="time" />
          <Column title="Car" dataIndex="car" key="car" />
          <Column title="Crime" dataIndex="crime" key="crime" />
          <Column title="Injury" dataIndex="injury" key="injury" />
          <Column title="Action" dataIndex="action" key="action" />
        </Table>
      </div>
     
    </Content>
  );
}

export default Home;
