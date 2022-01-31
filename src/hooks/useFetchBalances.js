import React, {useEffect, useState, useReducer} from 'react'
import { useWeb3React } from "@web3-react/core";

//non hook shit
import { getUserTokenBalance } from '../utils/fetchUserData';
import { POOLS } from '../config/pools';
import { ERC20Abi } from '../config/abis';
import { fastRefresh } from "../contexts/RefreshContext"
import useRefresh from '../utils/useRefresh';
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

    

    }
    console.log("STATE")
    console.log(state)
    return state
}

const initialState = {
    loading: true,
    balances: [],
    error: '',
}

const useFetchBalances = () => {

    const { fastRefresh } = useRefresh()
    const {active, account, library, connector} = useWeb3React();
    const [state, dispatch] = useReducer(balanceReducer, initialState)


    useEffect( async () => {
        if (active && library && account) {
            try {
                const userBalancePromises = POOLS.map( (pool) => {
                    const promise = getUserTokenBalance(
                        active, 
                        library.getSigner(),
                        account,
                        pool.tokenStakeAddress,
                        ERC20Abi
                        )
                    return promise
                })
                const _userBalances = await Promise.all(userBalancePromises)
                
         
                await dispatch({type: 'balances', payload: _userBalances})
    
            } catch (err) {console.log(err)}
        } 
        
    }, [account, active, library, fastRefresh])


    return {
        data: state,
        error: "fill me up"
    }
}

export default useFetchBalances
