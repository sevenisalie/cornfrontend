import React, {useEffect, useState, useReducer} from 'react'
import { useWeb3React } from "@web3-react/core";
//non hook shit
import { getUserTokenBalance } from '../utils/fetchUserData'
import { POOLS } from '../config/pools'
import { ERC20Abi } from '../config/abis'
import ADDRESSES from "../config/build/deployments/map.json"
import CONTROLLERCONTRACT from "../config/build/contracts/Controller.json"
import {addresses} from "../config/addresses"

import { fastRefresh } from "../contexts/RefreshContext"
import {approveControllerWithGasTank} from "../utils/portfolio"
import useRefresh from '../utils/useRefresh'
import useGraphQuery from "../hooks/useGraphQuery"

import { fetchGasBalance, writeContract } from '../utils/nft'
import { gasTankQuery } from "../queries/portfolioQueries"




const balanceReducer = (state, action) => {

    switch (action.type) {

        case 'balances': {
            return {
                ...state,
                balances: action.payload,
                loading: false
            }
        }
        case 'gasBalance': {
            return {
                ...state,
                gasBalance: action.payload,
                loading: false
            }
        }
        case 'loading': {
            return {
                ...state,
                loading: !state.loading
            }
        }
        case 'error': {
            return {
                ...state,
                error: action.payload,
                loading: true
            }
        }
        case 'setController': {
            return {
                ...state,
                setController: action.payload,
               
            }
        }

    

    }
  
    return state
}

const initialState = {
    loading: true,
    balances: [],
    error: '',
    setController: "",
    gasBalance: ""
}



const useFetchBalances = () => {

    const { fastRefresh } = useRefresh()
    const {active, account, library, connector} = useWeb3React();
    const [state, dispatch] = useReducer(balanceReducer, initialState)
    const [gasTankApproval, setGasTankApproval] = useState(false)
    
    const [gasTankQueryData, setGasTankQueryData] = useState("")
    const [gasTankData, setGasTankData] = useState(0)
    
    const {data: balanceData} = useGraphQuery(gasTankQueryData, "gas-tank")


    
    useEffect( () => {
        if (account) {
            setGasTankQueryData(gasTankQuery(account.toLowerCase()))
            console.log("pppppppp", gasTankQueryData)
        }
    }, [account])

    useEffect( () => {
        console.log("balanceData", balanceData)
        if (balanceData.payers !== undefined && balanceData.payers[0] !== undefined && balanceData.payers[0].payees.length > 0) {
            balanceData.payers[0].payees.map(( payee ) => {
                console.log("qqqqqqqq", payee)
                if(payee !== undefined && payee.payee.id === addresses.vaults.controller.toLowerCase()) {
                    setGasTankApproval(payee.approved)
                }
            })
        }
      }, [balanceData])
    

    useEffect( () => {
        if (active) {
            const nftctr = writeContract(
                active,
                library.getSigner(),
                account,
                ADDRESSES["137"]["Controller"].at(0),
                CONTROLLERCONTRACT.abi,
            )
            .then( value => {

                dispatch({ type: 'setController', payload: value})
      
                
            })
            
        } else {
            console.log("set controller failed for some reason idk")
        }
    }, [active, account])


    useEffect( async () => {
        if (account && state.setController !== '') {
            const gasAmount = await fetchGasBalance(
                state.setController,
                account
            )
            dispatch({ type: 'gasBalance', payload: gasAmount})

            
        } else {
            console.log("setting gas failed, who knows why. check if contract loaded")
        }
    }, [active, account, state.setController])

    const approvalFunction = async () => {
        if (library) {
            await approveControllerWithGasTank(library.getSigner())
            setGasTankApproval(true)
        }
    }



    return {
        data: state,
        balanceData: balanceData,
        approval: gasTankApproval,
        approvalFunction: approvalFunction,
        error: "fill me up"
    }
}

export default useFetchBalances
