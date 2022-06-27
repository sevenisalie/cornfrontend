import React, { useState, useEffect} from 'react'
import axios from "axios"

import RESOLVER from "../config/build/contracts/Resolver.json"
import {addresses} from "../config/addresses"
import useRefresh from '../utils/useRefresh';
import { useWeb3React } from '@web3-react/core';
import {fetchRouterInfo, checkApproval} from "../utils/swap"
import useFetchContractWrite from "../hooks/useFetchContractWrite"

const useFetchRouterInfo = (_tokenA, _tokenB, _amount) => {
    const [data, setData] = useState("")
    const {account, library} = useWeb3React()
    const { fastRefresh, verySlowRefresh, slowRefresh } = useRefresh()
    const [contract] = useFetchContractWrite(addresses.vaults.resolver, RESOLVER.abi)
    const [approval, setApproval] = useState(false)
    const [refreshTrigger, setRefreshTrigger] = useState(false)

    useEffect(() => {
        //fetch
        if (contract) {
            const updateRouterInfo = async (tokenA, tokenB, amount, resolver) => {
                const response = await fetchRouterInfo(tokenA, tokenB, amount, resolver)
                setData(response)
                console.log("RESPONSE", response)
            }
            updateRouterInfo(_tokenA, _tokenB, _amount, contract)

        }

    }, [contract, _tokenA, _tokenB, _amount, fastRefresh])

    useEffect(() => {
        if (account && contract && data){
            const updateApproval = async (_routerInfo, _account, _signer) => {
                const response = await checkApproval(_routerInfo, _account, _signer)
                setApproval(response)
            }
            updateApproval(data, account, library.getSigner())
        }

    }, [account, contract, data, refreshTrigger])

    const triggerRefresh = () => {
        setRefreshTrigger(prev => !prev)
    }

    return {
        data,
        approval,
        triggerRefresh
    }
}

export default useFetchRouterInfo
