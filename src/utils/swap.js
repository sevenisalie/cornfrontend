import {ethers} from "ethers";
import React, {useEffect, useState} from "react";
import { useWeb3React } from "@web3-react/core";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RESOLVER from "../config/build/contracts/Resolver.json"
import ERC20 from "../config/build/contracts/ERC20.json"
import TOKENLIST from "../config/TOKENLIST.json"
import {ROUTERS} from "../config/routers"
import { addresses } from "../config/addresses";
import { toFixed } from "./nft"
const TOKENS = TOKENLIST["tokens"]


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

const readContract = async (_provider, _address, _abi) => {
    try {
        const ctr = new ethers.Contract(_address, _abi, _provider)
        if (ctr.address) {
            return ctr
        }
    } catch (err) {
        console.log(err)
    }
}

export const CornProvider = async () => {
    try {
        const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
        return provider
    } catch (err) {
        console.log(err)
    }
}

export const checkApproval = async (routerInfo, account, signer) => {
    const ctr = new ethers.Contract(routerInfo.path[0].address, ERC20.abi, signer)
    const allowance = await ctr.allowance(account, addresses.vaults.resolver)
    const formattedAllowance = ethers.utils.formatUnits(allowance, "ether");

    if (formattedAllowance !== "0.0") {

        return true
    } else {
        return false
    }
}

export const approveToken = async (tokenAddress, spender, signer) => {
    try {
    const ERC20Contract = new ethers.Contract(tokenAddress, ERC20.abi, signer);
    const tx = await ERC20Contract.approve(
        spender,
        ethers.constants.MaxUint256,
        )
        return tx
    } catch (err) {console.log(err)}
};//works

const _fetchPrice = async (_tokenA, _tokenB, _amount, _router) => {
    const token = _matchToken(_tokenA.address)
    const amount = ethers.utils.parseUnits(_amount, token.decimals)
    
    const callData = await _router.findBestPathExactIn(
        _tokenA.address,
        _tokenB.address,
        amount
    )

     
    return {
        router: callData[0],
        path: callData[1],
        amountOut: callData[2],
        amountIn: _amount
    }
}

const _matchRouter = (_routerAddress) => {
    const matchedRouter = ROUTERS.filter( (router) => {

        if (_routerAddress.toLowerCase() === router.address.toLowerCase()) {
            return router
        }
    })

    return matchedRouter[0]
    
}

const _matchToken = (_tokenAddress) => {


    const matchedToken = TOKENS.filter( (token) => {
        if (_tokenAddress.toLowerCase() === token["address"].toLowerCase()) {
            return token
        } 
    })

    return matchedToken[0]
}

const _cleanPriceData = async (_priceData) => {
    const bestRouter = _priceData.router
    const bestPath = _priceData.path
    const amountOut = _priceData.amountOut
    const amountIn = _priceData.amountIn

   
    const routerInfo = _matchRouter(bestRouter)

    const pathInfo = bestPath.map( (token) => {

        const _token = _matchToken(token)
        return _token
    })
    const bestAmountOut = ethers.utils.formatUnits(
        amountOut, 
        pathInfo[pathInfo.length - 1].decimals)

    return {
        router: routerInfo,
        path: pathInfo,
        amountOut: bestAmountOut,
        amountIn: amountIn
    }
}


export const fetchRouterInfo = async (tokenA, tokenB, amountIn, resolverContract) => {
    try {
  
    const price = await _fetchPrice(
        tokenA,
        tokenB,
        amountIn,
        resolverContract
    )
    const data = await _cleanPriceData(price)
    return data
    } catch (err) {
        console.log("FETCHROUTERINFO ERROR")
        console.log(err)
    }
}


export const EasySwap = async (routerInfo, _slippage, signer, contract) => {
    const slipco = 1 - (parseFloat(_slippage) / 100)
    const slippage = parseFloat(routerInfo.amountOut) * slipco
    const slippageString = slippage.toString()
    const router = routerInfo.router.address
    const amountIn = ethers.utils.parseUnits(routerInfo.amountIn, routerInfo.path[0].decimals)
    const amountOutMin = ethers.utils.parseUnits(toFixed(slippageString, 6), routerInfo.path[routerInfo.path.length - 1].decimals)
    const path = routerInfo.path.map( (token) => {
        return token.address
    })
    const to = await signer.getAddress()
    const deadline = Math.floor(Date.now() / 1000) + 100


        const tx = await contract.swapExactIn(
            router,
            amountIn,
            amountOutMin,
            path,
            to,
            deadline,
          )

        return tx
    
    
}