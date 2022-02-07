import React, {useEffect, useState, useReducer} from 'react'
import { useWeb3React } from "@web3-react/core";
import axios from "axios"

//non hook shit
import { getUserTokenBalance } from '../utils/fetchUserData';
import { POOLS } from '../config/pools';
import { ERC20Abi } from '../config/abis';
import { fastRefresh, verySlowRefresh } from "../contexts/RefreshContext"
import useRefresh from '../utils/useRefresh';

// TokenStakeName apydata
// TokenLogo basePoolData
// DepositFee basePoolData
// Multiplier basePoolData
// poolTVL apydata
// APR apydata
// TokenEarnName basepoolData
// approval userpooldata
// userWalletTokenStakeAmount
// userStakedAmount userpooldata

const poolReducer = (state, action) => {
    switch (action.type) {
        case 'userData': {
            return {
                ...state,
                userData: action.payload,
                userDataLoading: false
            }
        }
        case 'apyData': {
            return {
                ...state,
                apyData: action.payload,
                apyDataLoading: false
            }
        }
        case 'allData': {
            return {
                ...state,
                allData: action.payload,
                loading: false
            }
        }
        case 'userDataloading': {
            return {
                ...state,
                userDataLoading: !state.userDataLoading
            }
        }
        case 'apyDataLoading': {
            return {
                ...state,
                apyDataloading: !state.apyDataloading
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
    console.log("poolReducer State")
    console.log(state)
    return state
}

const initialState = {
    allData: {},
    userData: [],
    apyData: [],
    userDataloading: true,
    apyDataLoading: true,
    error: null,
}

const useFetchPoolData = (_user) => {
    const [state, dispatch] = useReducer(poolReducer, initialState)
    const { verySlowRefresh } = useRefresh()
    const {active, account, library, connector} = useWeb3React();


    const getSetAPYData = async () => {
        try {
            const url = "https://cornoracleapi.herokuapp.com/poolData/"
            const call = await axios.get(url)
            const data = call.data
            dispatch({ type: "apyData", payload: data })
            return data
        } catch (err) {
            console.log(err)
            dispatch({ type: "error", payload: err })
        }
    }

    const getSetUserData = async (_userAddress) => {
        try {
            const url = `https://cornoracleapi.herokuapp.com/chef2/userPoolData/${_userAddress}`
            const call = await axios.get(url)
            const data = call.data
            dispatch({ type: 'userData', payload: data })
            return data
        } catch (err) {
            console.log(err)
            dispatch({ type: 'error', payload: err })
        }
    }



    const mergeData = async (userData, apyData) => {
        const data = POOLS.map( (pool) => {
            return {
                pid: pool.pid,
                tokenStakeName: pool.tokenStakeName,
                tokenStakeAddress: pool.tokenStakeAddress,
                tokenEarnName: pool.tokenEarnName,
                depositFee: pool.depositFee,
                multiplier: pool.multiplier,
                poolurl: pool.poolurl,
                imageurl: pool.imageurl,
                ...userData[pool.pid],
                APY: apyData.POOLS[pool.pid]
            }
        })
        dispatch({ type: 'allData', payload: data })
    }

    const fetchBoth = async (_userAddress) => {
        const apy = await getSetAPYData()
        const user = await getSetUserData(_userAddress)
        await mergeData(user, apy)
    }
    
    useEffect(() => {
        if (active && account) {
            try {
            
                const data = fetchBoth(account)
                
               

            } catch (err) {

                dispatch({ type: "error", payload: err })

            }
        }
    }, [_user, verySlowRefresh])

 
    
    return {
        state: state
    }
}

export default useFetchPoolData
