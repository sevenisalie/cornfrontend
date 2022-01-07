import React, {useEffect, useState} from "react";
import {styled} from "styled-components";
import GlobalStyle from "./theme/GlobalStyle";
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';

//pages
import Home from "./pages/vaults";
import Vaults from "./pages/myvaults";
import NFT from "./pages/nftgallery";
import Pools from "./pages/pools";
import {NavigationBar} from "./components/NavigationBar";
import {Footer} from "./components/Footer"


function App() {
  return (
    <>
    <Router>
      <NavigationBar/>

        <Routes>

          <Route path='/' element={<Home/>} />
     
          <Route path='/vaults' element={<Vaults/>} />

          <Route path="/pools" element={<Pools/>} />

          <Route path="/nfts" element={<NFT/>} />

        </Routes>
      
    </Router>
    <Footer />
    </>
  );
}

export default App;
