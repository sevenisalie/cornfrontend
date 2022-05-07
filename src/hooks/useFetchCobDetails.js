import React, {useState, useEffect} from 'react'
import {ethers} from "ethers"
import BigNumber from "bignumber.js";

import {addresses} from "../config/addresses"
import { ERC20Abi } from '../config/abis'

import {CornProvider, readContract} from "../utils/nft"
import {Contract, Provider} from "ethers-multicall" 
import useFetchContractWrite from "./useFetchContractWrite"
import useFetchProvider from "./useFetchProvider"
import { mapTokenDetailCalls } from '../utils/multiCall';



const useFetchCobDetails = () => {
    const [results, setResults] = useState({})
    const [provider] = useFetchProvider()

 

    useEffect(() => {
        const fetchResults = async () => {
            const data = await mapTokenDetailCalls(provider)
            return setResults(data)
        }  
        if (provider) {
            try {
                fetchResults()
            } catch (err) {console.log(err)}
        }
    }, [provider])


    
    return [results]
}

export default useFetchCobDetails
