import {ethers} from "ethers";
import React, {useEffect, useState} from "react";
import { useWeb3React } from "@web3-react/core";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import RESOLVER from "../config/build/contracts/Resolver.json"
import ERC20 from "../config/build/contracts/ERC20.json"
import TOKENLIST from "../config/TOKENLIST.json"
import CONTROLLER from "../config/contracts/Controller.json"
import GAS_TANK from "../config/contracts/IGasTank.json"
import CONTROLLER_VIEW from "../config/contracts/ControllerView.json"

import {ROUTERS} from "../config/routers"
import { addresses } from "../config/addresses";
import { toFixed } from "./nft"

const goodToast = (msg) => {
    const ToastStyle = {
        borderRadius: "50px",
        color: "rgba(242, 242, 242, 0.87)",
        backdropFilter: "blur(12px) saturate(149%)",
        backgroundColor: "rgba(29, 30, 32, 0.87)",
        border: "2px solid rgba(251, 219, 55, 0.95)",
        padding: "0.42em",
        
    }

    const id = toast(`${msg}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        style: ToastStyle
    })
    toast.update(id, { render: `${msg}`, hideProgressBar: true, closeOnClick: true, position: "bottom-right", autoClose: 5000, className: 'rotateY animated', draggable: true})
}

export const writeContract = async (active, _signer, _account, _address, _abi) => {
    if (active) {
        try {
            const ctr = new ethers.Contract(_address, _abi, _signer)
            if (ctr.address) {
                return ctr
            } 
        } catch (err) {console.log(err)}
    }
}

async function fetchContract(address, abi, signer) {
    const contract = new ethers.Contract(address, abi, signer);
    console.log(`loaded contract ${contract.address}`);
    return contract;
  }


// ----------------------------------------------------------------------------------
// ///////////////////////////////// User Functions /////////////////////////////////
// ----------------------------------------------------------------------------------

async function approveStrategyWithERC20(tokenAddress, strategyAddress, amount, signer) {
    const erc20 = await fetchContract(tokenAddress, ERC20.abi, signer)
    return await erc20.approve(strategyAddress, amount);
  }
  
  // ----------------------------------------------------------------------------------
  
  async function approveControllerWithGasTank(signer) {
    const gasTank = await fetchContract(addresses.gasTank, GAS_TANK.abi, signer);
    return await gasTank.approve(addresses.controller, true);
  }
  
  // ----------------------------------------------------------------------------------
  
  async function depositGasTank(amount, signer) {
    const gasTank = await fetchContract(addresses.gasTank, GAS_TANK.abi, signer);
    return await gasTank.deposit(signer.address, amount);
  }
  
  // ----------------------------------------------------------------------------------
  
  async function withdrawGasTank(amount, signer) {
    const gasTank = await fetchContract(addresses.gasTank, GAS_TANK.abi, signer);
    return await gasTank.withdraw(amount);
  }

  // ----------------------------------------------------------------------------------

async function withdraw(vaultId, tokenId, signer) {
    const controller = await fetchContract(addresses.controller, CONTROLLER.abi, signer);
    return await controller.withdraw(vaultId, tokenId);
  }
  
  // ----------------------------------------------------------------------------------
  
  export async function vaultTokensByOwner(owner, signer) {
    
    const controllerView = await fetchContract(addresses.vaults.controllerView, CONTROLLER_VIEW.abi, signer);
    console.log("HANKEMUPS")
    console.log(controllerView)
    const vaultTokens = await controllerView.vaultTokensByOwner(owner);

    const vaults = [];
    for(const vault of vaultTokens) {
        vaults.push({
            vault: vault.vault,
            tokenId: vault.tokenId.toNumber()
        })
    }
    return vaults;
  }