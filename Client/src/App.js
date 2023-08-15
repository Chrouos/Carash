import "./css/App.css";

import HeaderComponent from "./components/Header";
import FooterComponent from "./components/Footer";
import Chat from "./views/Chat";
import Home from "./views/Home";
import Agent from "./views/Agent";

import React from "react";
import { Layout } from "antd";
import { Route, Routes } from "react-router-dom";

import axios from './utils/axios';

function App() {

  return (  

    <div style={{height: '100%'}}>
      <Layout style={{height: '100%'}}>

        <HeaderComponent></HeaderComponent>

        <Routes>
          <Route path="/chat" element={ <Chat /> } />
          <Route path="/" element={ <Home /> } />
          <Route path="/agent" element={ <Agent /> } />
        </Routes>
        
        <FooterComponent></FooterComponent>

      </Layout>
    </div>

  );
}

export default App;
