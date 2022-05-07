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
import useRefresh from '../utils/useRefresh'




const useFetchPendingRewards = (_trigger) => {
    const [results, setResults] = useState('')
    const [contract] = useFetchContractWrite(addresses.masterChefTest, masterchef.abi)
    const {account, library, active} = useWeb3React()
    const [total, setTotal] = useState('')
    const { fastRefresh, slowRefresh } = useRefresh()
    const [trigger, setTrigger] = useState(_trigger) //bool (why dont i just write ts good fucking god)


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
                const callData = await mapPendingCobCalls(library.getSigner(), account)
                setResults(callData)
    
                const sum = getSum(callData)
                setTotal(toFixed(sum, 2))

            }   
        } catch (err) {console.log(err)}
        
    }, [trigger, account, slowRefresh ])




    return {
        contract: contract, 
        results: results, 
        total: total}
}

export default useFetchPendingRewards
