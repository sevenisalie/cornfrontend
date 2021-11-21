// const { BigNumber } = require("ethers");
// const hre = require("hardhat");
// const ethers = hre.ethers;
// const axios = require("axios");
import React, { useState, useEffect} from "react"
import axios from "axios"
import {ethers} from "ethers"
//contract imports
import {MasterChefV2} from "./artifacts/MasterChefV2"
import {ERC20Abi} from "./abi"


const contractAddresses = {
    masterChef: "0xC71EbC899BCC111F39B2715B5d2D397E671B5bd2",
    CobToken: "0x793AcF39c3d605d3aD042Ae01fd290a6fE489164",
    mockToken1: "0x7DBaFf79d13A0c842777742A86aE3aCAc9817250",
    mockToken2: "0xCCd1660797fe05dAe3439568aD39D2a4DacEab0e",
    mockLP: "0xea718C7dd15C6E1F98de3ED10f50d812e39E66D2",
    realLP: "0xadbF1854e5883eB8aa7BAf50705338739e558E5b",
    realLP2: "0xEEf611894CeaE652979C9D0DaE1dEb597790C6eE",
    CobUSDCLP: "0x972575f78ee1738fc578289b1de98e0cd90c0119"
};

const provider = new ethers.providers.JsonRpcProvider("https://rpc-mainnet.maticvigil.com/v1/4b331c188697971af1cd6f05bb7065bc358b7e89");


// fetchies
export const useSigner = async (library) => {
    const [signer, setSigner] = useState(null)
    
    setSigner(library.getSigner())
    

    console.log(`Signer Loaded`);
    
    return signer;
};//works


export const useContract = async (address, abi, signer) => {
    const contr = new ethers.Contract(address, abi, signer);
    const [contract, setContract] = useState(contr)
    console.log(`loaded contract ${contract.address}`);
    setContract(new ethers.Contract(address, abi, signer))
    return contract;
};//works

const usePendingReward = async (pid, user, signer) => {
    const masterchefContract = await useContract(contractAddresses.masterChef, MasterChefV2.abi, signer);
    const balances = await masterchefContract.pendingCob(pid, user);
    return balances;
} //works


export const useApproveToken = async (tokenAddress, spender, signer) => {
    const ERC20Contract = await useContract(tokenAddress, ERC20Abi, signer);
    const approval = await ERC20Contract.approve(spender, ethers.constants.MaxUint256);
    return approval
};//works

export const useERC20 = async (tokenAddress, spender, signer) => {
    const ERC20Contract = await useContract(tokenAddress, ERC20Abi, signer);
    return ERC20Contract;
};//works

// pool stuff

// const createPool = async (poolToken) => {
//     const signer = await fetchSigner();
//     const LPtoken = await fetchContract(poolToken, UniswapV2PairAbi, signer);
//     const masterchefContract = await fetchContract(contractAddresses.masterChef, masterchef.abi, signer);
//     console.log(`loaded MasterChef ${masterchefContract.address}
//                 Adding Pool for ${LPtoken.address} 
//     `);
//     const allocPoint = ethers.utils.parseUnits("50", "wei");
//     const depositFeeBP = BigNumber.from(9000);
//     const withUpdate = true;
//     const addPool = await masterchefContract.add(allocPoint, LPtoken.address, depositFeeBP, withUpdate);
//     return addPool;
// }; //works


// const approvePool = async (lptoken) => {
//     const approvepooltoken = await approveToken(lptoken, contractAddresses.masterChef);
//     return approvepooltoken

// } //works

// const deposit = async (pid, amount) => {
//     const signer = await fetchSigner();
//     const masterchefContract = await fetchContract(contractAddresses.masterChef, masterchef.abi, signer);
//     const depositinpool = await masterchefContract.deposit(pid, amount);
//     return depositinpool;
// } //works

// const withdraw = async (pid, amount) => {
//     const signer = await fetchSigner();
//     const masterchefContract = await fetchContract(contractAddresses.masterChef, masterchef.abi, signer);
//     const withdrawinpool = await masterchefContract.withdraw(pid, amount);
//     return withdrawinpool;
// } //works

// const updatePool = async () => {
//     const signer = await fetchSigner();
//     const masterchefContract = await fetchContract(contractAddresses.masterChef, masterchef.abi, signer);
//     const update = await masterchefContract.massUpdatePools();
//     return update;
// }

// const getOwner = async () => {
//     const signer = await fetchSigner();
//     const masterchefContract = await fetchContract(contractAddresses.masterChef, masterchef.abi, signer);
//     const ownerAddress = await masterchefContract.owner();
//     return ownerAddress
// }





