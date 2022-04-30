import React, {useState, useEffect} from 'react'
import {ethers} from "ethers"
import {POOLS} from "../config/pools"
import {addresses} from "../config/addresses"
import masterchef from '../config/artifacts/contracts/MasterChefV2.sol/MasterChefV2.json'

import useFetchContractWrite from './useFetchContractWrite'
import { useWeb3React } from '@web3-react/core'
import { getUserStakedBalance } from '../utils/fetchUserData'
import { toFixed } from "../utils/nft"
import {mapPendingCobCalls, resolvePendingCobCalls} from "../utils/multiCall"



const useFetchPendingRewards = () => {
    const [results, setResults] = useState('')
    const [contract] = useFetchContractWrite(addresses.masterChefTest, masterchef.abi)
    const {account, library, active} = useWeb3React()
    const [total, setTotal] = useState('')

    const getSum = (_results) => {
        let n = 0;
        _results.forEach(i => {
            const number = parseFloat(i)
            n = n + number
        });

        return n.toString()
    }

    useEffect( async () => {
        try {
            if (account) {
                const callData = await mapPendingCobCalls(library.getSigner())
                setResults(callData)
    
                const sum = getSum(callData)
                setTotal(toFixed(sum, 2))
            }   
        } catch (err) {console.log(err)}
        
    }, [account])




    return [contract, results, total]
}

export default useFetchPendingRewards
