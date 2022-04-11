import React, {useReducer, useState, useEffect} from 'react'
import axios from "axios"
import { useWeb3React } from "@web3-react/core"

//
import RESOLVER from "../config/build/contracts/Resolver.json"
import ADDRESSES from "../config/build/deployments/map.json"
import { writeContract } from '../utils/nft'



const routeReducer = (state, action) => {
    switch (action.type) {

        case "loading": {
            return {
                ...state,
                loading: action.payload
            }
        }
        case "tokenA": {
            return {
                ...state,
                tokenA: action.payload
            }
        }
        case "tokenB": {
            return {
                ...state,
                tokenB: action.payload
            }
        }
        case "amount": {
            return {
                ...state,
                amount: action.payload
            }
        }
        case "price": {
            return {
                ...state,
                price: action.payload
            }
        }
        case "router": {
            return {
                ...state,
                router: action.payload
            }
        }

    }
}

const initialState = {
    loading: true,
    tokenA: "",
    tokenB: "",
    amount: "",
    price: "",
    router: "loading",
}

const useFetchRouteInfo = (_tokenA, _tokenB, _amount) => {
    const [state, dispatch] = useReducer(routeReducer, initialState)
    const {active, account, library, connector} = useWeb3React();


    useEffect( () => {
        dispatch({ type: "tokenA", payload: _tokenA})
        dispatch({ type: "tokenB", payload: _tokenB})
        dispatch({ type: "amount", payload: _amount})

    }, [])

    useEffect(  () => {
        const loadContract = async () => {
            try {
                const contract = writeContract(
                active,
                library.getSigner(),
                account,
                ADDRESSES["137"]["Resolver"][0],
                RESOLVER.abi,
                )

                dispatch({ type: 'router', payload: contract})

       
            } catch ( err ) {console.log(err)}

            loadContract()
        }
        if (active) {

    
        } 
    }, [active, account])



    useEffect( () => {

        const getBestRoute = async (tokenA, tokenB, amount, _router) => {
            try {
                const callData = await _router.findBestPath(
                    tokenA,
                    tokenB,
                    amount,
                )
                dispatch({type: "price", payload: callData})
    
            } catch (err) {
                console.log("ROUTING ERRO") 
                console.log(err)
                console.log(_router)
                return err
            }
        }

            try {
                getBestRoute(
                    state.tokenA,
                    state.tokenB,
                    state.amount,
                    state.router
                )
            } catch (err) {
                console.log(err)
            }
        
    }, [state.router])

    

    
    console.log("Router Data")
    console.log(state)
   
    return {
     
        state
    }
}

export default useFetchRouteInfo
