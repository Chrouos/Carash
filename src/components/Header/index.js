import React from "react";

import { Layout, Menu } from "antd";
const {Header} = Layout;

const HeaderComponent = () => {
  
  
  const selectedKeyToLink = (selectedKey) => {
    window.location.href = '/#' + selectedKey ;
  }
  
    
  return(
      <Header style={{display: 'flex', alignItems: 'center'}}>
        {/* <div className="demo-logo" /> */}
        
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={'/' + [window.location.href.split('/')[4]]} 
              onClick={ (e) => selectedKeyToLink(e.key) }
        
          items={[
            {key: '/', label: 'Home'},
            {key: '/chat', label: 'Chat'},
          ]}
        >
        </Menu>

      </Header>
  )
}

export default HeaderComponent;

