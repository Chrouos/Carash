import React from "react";
import { Layout } from "antd";
const { Content } = Layout;


function Home() {


  return (
    <Content style={{ padding: '5%', height: '100%' }}>

      {/* <div>
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
      </div> */}
     
    </Content>
  );
}

export default Home;
