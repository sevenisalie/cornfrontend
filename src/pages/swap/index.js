import React, {useEffect, useState, useReducer} from 'react'
import {Page} from "../../components/Page"
import styled from "styled-components";
import SwapPageHeading from "./components/SwapPageHeading";
import LimitOrderEntry from './components/LimitOrderEntry'

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
