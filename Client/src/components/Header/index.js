import React from "react";
import './styles.css';

import { Layout, Menu } from "antd";
const {Header} = Layout;

const HeaderComponent = () => {
  
  
  const selectedKeyToLink = (selectedKey) => {
    window.location.href = '/#' + selectedKey ;
  }
  
    
  return(
      <Header className="header" >
        <div style={{width: '-webkit-fill-available', fontSize: '120%' }} >Web Intelligence and Data Mining Lab</div>

        <Menu  className="header-menu"
              mode="horizontal" 
              defaultSelectedKeys={'/' + [window.location.href.split('/')[4]]} 
              onClick={ (e) => selectedKeyToLink(e.key) }
        
          items={[
            {key: '/agent', label: 'Agent'},
            {key: '/chat', label: 'Chat'},
            {key: '/', label: 'Home'},
          ]}
        >
        </Menu>

      </Header>
  )
}

export default HeaderComponent;

