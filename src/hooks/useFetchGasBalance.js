import React, {useEffect, useState, useReducer} from 'react'
import { useWeb3React } from "@web3-react/core";
CONTROLLERCONTRACT
//non hook shit
import { getUserTokenBalance } from '../utils/fetchUserData';
import { POOLS } from '../config/pools';
import { ERC20Abi } from '../config/abis';
import { fastRefresh } from "../contexts/RefreshContext"
import useRefresh from '../utils/useRefresh';
import { fetchGasBalance, writeContract } from '../utils/nft';
import ADDRESSES from "../config/build/map.json"
import CONTROLLERCONTRACT from "../config/build/contracts/Controller.json"


const balanceReducer = (state, action) => {

    switch (action.type) {

        case 'balances': {
            return {
                ...state,
                balances: action.payload,
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
                setController: action.payload
            }
        }

    

    }
    console.log("STATE")
    console.log(state)
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


    useEffect( () => {
        if (account && state.setController !== '') {
            const gasAmount = fetchGasBalance(
                state.setController,
                account
            )
            .then( value => {
                dispatch({ type: 'gasBalance', payload: value})
      
                
            })
            
        } else {
            console.log("setting gas failed, who knows why. check if contract loaded")
        }
    }, [active, account, state.setController])


    


    return {
        data: state,
        error: "fill me up"
    }
}

export default useFetchBalances
