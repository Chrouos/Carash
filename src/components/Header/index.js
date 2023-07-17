import React from "react";

import { Layout, Menu } from "antd";
const {Header} = Layout;

const HeaderComponent = (props) => {

    const headerMenuTitle = props.HeaderMenuTitle;
    
    return(
        <Header style={{display: 'flex', alignItems: 'center'}}>
          {/* <div className="demo-logo" /> */}

          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["2"]}
            items={headerMenuTitle}
          />
        </Header>
    )
}

export default HeaderComponent;

