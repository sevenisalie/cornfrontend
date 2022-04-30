import {ethers} from "ethers";
import React, {useEffect, useState} from "react";
import { useWeb3React } from "@web3-react/core";
import { addresses } from "../config/addresses";
import {nftABI} from "../config/abis";
import {nftURI} from "../config/uri";
import axios from "axios"

//stupid shit please make me a better programmer one day for the love of christ
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//ABIs
import {ERC20Abi} from "../config/abis"


export const writeContract = async (active, _signer, _account, _address, _abi) => {
    if (active) {
        try {
            const ctr = new ethers.Contract(_address, _abi, _signer)
            if (ctr.address) {
                return ctr
            } else {
                console.log("Contract failed to load, refresh signer")
            }
        } catch (err) {console.log(err)}
    }
}

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


export const userMint = async (_nftContract, fee) => {
    const ctr = _nftContract;
    try {
        const mint = await ctr.mint({value: fee})
        return mint
    } catch (err) {
        console.log(err)
        goodToast(`${err.data.message}`)
    }
}


const getNFTData = async () => {
    const data = axios.get(nftURI)
    .then(value => {
        return value
    })
}


//staking stuff
export const fetchPoolAllowance = async (_POOLS, _signer, account, masterchefAddress) => {

    const calls = _POOLS.map( async (pool) => {
        const token = pool.tokenStakeAddress;
        const ctr = new ethers.Contract(token, ERC20Abi, _signer)
        const allowance = await ctr.allowance(account, masterchefAddress)
        const formattedAllowance = ethers.utils.formatUnits(allowance, "ether");

        if (formattedAllowance !== "0.0") {
            return {approved: true}
        } else {
            return {approved: false}
        }
    })

    const callResults = await Promise.all(calls)
    console.log(`These are your call results from allowance ${callResults}`)
    console.log(callResults)
    return callResults

}

export const fetchTokenStakeBalance = async (pools, _signer, account) => {

try {    const calls = pools.map( async (pool) => {
        const token = pool.tokenStakeAddress;
        const call = await getTokenStakeBalance(token, _signer, account)
        const formattedCall = ethers.utils.formatUnits(call, "ether")
        const cleancall = stringToFixed(formattedCall, 3)
        return cleancall
    })

    const callResults = await Promise.all(calls)
    console.log(callResults)
    return callResults
    } catch (err) {console.log(err)}

}

export const setPoolAllowance = async (tokenAddress, masterchef, _signer) => {
    const ctr = new ethers.Contract(tokenAddress, ERC20Abi, _signer)
    try {
        const approve = await ctr.approve(masterchef.address, ethers.constants.MaxUint256) 
        const receipt = await approve.wait()
        return receipt
    } catch (err) {
        console.log(err)
        goodToast(`${err.data.message}`)
    }
}


export const getTokenStakeBalance = async (tokenAddress, _signer, account) => {
    const ctr = new ethers.Contract(tokenAddress, ERC20Abi, _signer)
    try {
        const balance = await ctr.balanceOf(account)
        return balance
    } catch (err) {console.log(err)}
}

// const balances = poolData.map( async (value, index) => {
//     const address = value.tokenStakeAddress
//     const erc20 =  await writeContract(_active, signer, account, address, abi)
//     const masterChefAddress = "0xC71EbC899BCC111F39B2715B5d2D397E671B5bd2"
//     const balance =  await erc20.balanceOf(masterChefAddress)
//     const stringbal = ethers.utils.formatUnits(balance, "ether")
//     return stringbal
// });

// const results = await Promise.all(balances)
// return results


export const userStake = async (_masterchef, pid, amount, decimals) => {
    const ctr = _masterchef;
    console.log("HANKUS")
    console.log(ctr)
    console.log(pid)
    console.log(amount)
    try {
        //const strAmount = amount.toString();
        const bigNumAmount = ethers.utils.parseUnits(amount, decimals)
        const formattedBigNumAmount = ethers.utils.formatUnits(bigNumAmount, decimals)
        const strPid = pid.toString();

        const tx = await ctr.deposit(strPid, bigNumAmount);
        return tx
    } catch (err) {
        console.log(err)
        goodToast(`${err.data.message}`)
    }
}

export const userUnstake = async (_masterchef, pid, amount, decimals) => {
    const ctr = _masterchef;

    try {
     
        //const strAmount = amount.toString();
        const bigNumAmount = ethers.utils.parseUnits(amount, decimals)
        const formattedBigNumAmount = ethers.utils.formatUnits(bigNumAmount, 18)
        const strPid = pid.toString();

        const tx = await ctr.withdraw(strPid, bigNumAmount);
        return tx

    } catch (err) {
        console.log(err)
        goodToast(`${err.data.message}`)
    }
}

export const userClaim = async (_masterchef, pid) => {
    const ctr = _masterchef;
    const amount = 0;
    try {
        const strAmount = amount.toString();
        const strPid = pid.toString();

        const tx = await ctr.deposit(strPid, strAmount)
        return tx
    } catch (err) {
        console.log(err)
        goodToast(`${err.data.message}`)
    }
}

export const toFixed = (num, fixed) => {
    try {
      var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
      return num.toString().match(re)[0];
    } catch (err) {
      console.log(err)
      return "0"
    }

  }

  export const stringToFixed = (str, fixed) => {
    try {
      var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
      return str.match(re)[0];
    } catch (err) {
      console.log(err)
      return "0"
    }

  }



  export const createLimitTrade = async (pid, tokenIn, tokenInDecimals, tokenOut, amountIn, price, _controllerContract) => {
    console.log("DICKSDICKSDICKDIDCKS")
    const path = [tokenIn, tokenOut]
    const bigNumAmountIn = ethers.utils.parseUnits(amountIn, tokenInDecimals)
    const bigNumPrice = ethers.utils.parseUnits(price, 18)
    const amounts = [bigNumAmountIn, bigNumPrice]
    const times = [0]
    const maxGas = 1000000000000
    
    const ctr = _controllerContract
    try {
        const mint = await ctr.createTrade(
        pid,
        path,
        amounts,
        times,
        maxGas
        )
        return mint
    } catch (err) {console.log(err)}
}

export const fetchGasBalance = async (_controllerContract, _user) => {
    try {
        const call = await _controllerContract.userGasAmounts(_user)
        const amount = ethers.utils.formatUnits(call, 18)
        console.log("GAS AMOUNT")
        console.log(amount)
        return amount
    } catch (err) {console.log(err)}
}


// router
