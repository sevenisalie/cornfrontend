import {ethers} from "ethers";
import React, {useEffect, useState} from "react";
import { useWeb3React } from "@web3-react/core";
import { addresses } from "../config/addresses";
import {nftABI} from "../config/abis";
import {nftURI} from "../config/uri";
import axios from "axios"

//get signer


//connect signer to contract


export const writeContract = async (active, _provider, _account, _address, _abi) => {
    if (active) {
        try {
            const ctr = new ethers.Contract(_address, _abi, _provider)
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