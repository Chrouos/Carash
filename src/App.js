import "./App.css";

import HeaderComponent from "./components/Header";
import FooterComponent from "./components/Footer";
import Chat from "./views/Chat";

import React from "react";
import { Layout } from "antd";


function App() {

  const headerMenuTitle = ["Home", "Chat"].map((label, index) => {
    const key = String(index + 1);
    return {
      key,
      label
    }
  });

  return (
    <div style={{height: '100%'}}>

      <Layout style={{height: '100%'}}>

        <HeaderComponent HeaderMenuTitle={headerMenuTitle}></HeaderComponent>
        
        {/* TODO: react router */}
        <Chat/>        

        <FooterComponent></FooterComponent>

      </Layout>
    </div>
  );
}

export default App;
