import React, {useEffect, useState, useReducer} from 'react'
import { useWeb3React } from '@web3-react/core';
import NFTS from "../config/nfts"
import TestNFT from "../config/nftbuild/contracts/TestNFT.json"
import {writeContract} from "../utils/nft"

const NFTABI = TestNFT.abi

const nftReducer = (state, action) => {
    switch (action.type) {
        case "loading": {
            return {
                ...state,
                loading: action.payload
            }
        }
        case "nftContracts": {
            return {
                ...state,
                nftContracts: action.payload
            }
        }
        case "nftData": {
            return {
                ...state,
                nftData: action.payload
            }
        }
    }
} 

const initialState = {
    loading: true,
    nftContracts: {},
    nftData: {}
}

const useFetchNFTCollections = () => {
    const [state, dispatch] = useReducer(nftReducer, initialState)
    const {active, account, library, connector} = useWeb3React();

    useEffect(() => {
        const data = NFTS
        dispatch({type: "nftData", payload: data})
    }, [])


    const fetchContract = (_address) => {
        const nftctr = writeContract(
            active,
            library.getSigner(),
            account,
            _address,
            NFTABI,
        )
        .then( value => {
            dispatch({ type: 'nftContracts', payload: value})
        })
    }

    useEffect( () => {
        if (active) {
            const contracts = NFTS.map( (nft) => {
                fetchContract(nft.address)
            }) 
            console.log("This is your fuckin data")
            console.log(state)
        } else {
            console.log("something happened and it wasnt good")
        }
    }, [active, account])
    return state
}

export default useFetchNFTCollections
