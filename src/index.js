import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import {GlobalStyle} from "./theme/GlobalStyle";

//web3 shit
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import {useWeb3React} from "@web3-react/core";

const getLibrary = (provider, connector)  => {
  return new ethers.providers.Web3Provider(provider);
}


ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
    <GlobalStyle />
    <App />
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
);


