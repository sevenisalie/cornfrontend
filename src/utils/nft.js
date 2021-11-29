import {ethers} from "ethers";
import React, {useEffect, useState} from "react";
import { useWeb3React } from "@web3-react/core";
import { addresses } from "../config/addresses";
import {nftABI} from "../config/abis";
import {nftURI} from "../config/uri";
import axios from "axios"

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



export const userMint = async (_nftContract, recipient, _tokenURI) => {
    const ctr = _nftContract;
    try {
        const mint = await ctr.mintNFT(recipient, _tokenURI)
        return mint
    } catch (err) {console.log(err)}
}


const getNFTData = async () => {
    const data = axios.get(nftURI)
    .then(value => {
        return value
    })
}


//staking stuff
export const fetchPoolAllowance = async (pools, _signer, account, masterchef) => {

    const calls = pools.map( async (pool) => {
        const token = pool.tokenStakeAddress;
        const ctr = new ethers.Contract(token, ERC20Abi, _signer)
        const allowance = await ctr.allowance(account, masterchef.address)
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
        return approve
    } catch (err) {console.log(err)}
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


export const userStake = async (_masterchef, pid, amount) => {
    const ctr = _masterchef;
    try {
        const strAmount = amount.toString();
        const strPid = pid.toString();

        await ctr.deposit(strPid, strAmount);
    } catch (err) {console.log(err)}

}

export const userClaim = async (_masterchef, pid) => {
    const ctr = _masterchef;
    const amount = 0;
    try {
        const strAmount = amount.toString();
        const strPid = pid.toString();

        await ctr.deposit(strPid, strAmount)
    } catch (err) {console.log(err)}
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

  export const stringToFixed = (num, fixed) => {
    try {
      var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
      return num.toString().match(re)[0];
    } catch (err) {
      console.log(err)
      return "0"
    }

  }