import React, {useEffect, useState, useReducer} from 'react'
import {Page} from "../../components/Page"
import styled from "styled-components";
import SwapPageHeading from "./components/SwapPageHeading";
import LimitOrderEntry from './components/LimitOrderEntry'
import useFetchContractWrite from '../../hooks/useFetchContractWrite';
import { addresses } from '../../config/addresses';
import MASTERCHEF from "../../config/build/contracts/MasterChefV2.json";

const swapReducer = (state, action) => {
    switch (action.type) {
        case "loading": {
            return {
                ...state,
                loading: action.payload
            }
        }
    }
} 

const initialState = {
    loading: true
}

const Swap = () => {
    const [state, dispatch] = useReducer(swapReducer, initialState)
    const [contract, query] = useFetchContractWrite(addresses.masterChef, MASTERCHEF.abi)
    console.log("MASTERCHEF MY GUY")
    console.log(contract)
    return (
        <>
        <Page>
            
            <SwapPageHeading/>

            


            <LimitOrderEntry state={state} />



        </Page>
        </>
    )
}

export default Swap
