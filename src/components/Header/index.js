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
        
        <Menu style={{width: '100%', gap: '10px', fontSize: '1.3rem'}} 
              theme="dark" mode="horizontal" 
              defaultSelectedKeys={'/' + [window.location.href.split('/')[4]]} 
              onClick={ (e) => selectedKeyToLink(e.key) }
        
          items={[
            {key: '/', label: 'Home'},
            {key: '/chat', label: 'Chat'},
            {key: '/agent', label: 'Agent'},
          ]}
        >
        </Menu>

      </Header>
  )
}

export default HeaderComponent;

