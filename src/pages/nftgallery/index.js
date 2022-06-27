
import styled from "styled-components";
import {Page} from "../../components/Page"
import {ethers} from "ethers";
import React, {useEffect, useState, useReducer} from "react";
import { useWeb3React } from "@web3-react/core";

import { addresses } from "../../config/addresses";
import {NFTS} from "../../config/nfts"
import {POOLS} from "../../config/pools"

import {writeContract, userMint} from "../../utils/nft";
import {approveControllerWithGasTank} from "../../utils/portfolio";
import useFetchContractWrite from "../../hooks/useFetchContractWrite"
import useFetchRouterInfo from "../../hooks/useFetchRouterInfo"
import useFetchGasBalance from "../../hooks/useFetchGasBalance"


import {NFTCard} from "./components/NFTCard";
import MarketPageHeading from "./components/MarketPageHeading"
import HowToSection from "./components/HowToSection"
import LimitOrderEntry from './components/LimitOrderEntry'
import {GasTank} from "../../components/NavigationBar"

import useGraphQuery from '../../hooks/useGraphQuery'
import { gasTankQuery } from "../../queries/portfolioQueries";

import {HeaderButtonSecondary} from "../vaults/index"



const MyNFTContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 40px;
    margin-top: 300px;
    margin-bottom: 300px;
`

const MyNFTGrid = styled.div`
    margin-top: 25px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    justify-items: center;
    align-content: start;
    column-gap: 2px;
    row-gap: 20px;
    margin-bottom: 25px;

    @media (max-width: 768px) {
        flex-direction: column;
        grid-template-columns: auto;
        grid-template-rows: auto;
      }
  
`

const SubmitButton = styled(HeaderButtonSecondary)`
    width: auto;
    height: auto;
    margin: 0 0 0 0;
    align-self: center;
`

const MainContainer = styled.div`
    display: flex;
    height: auto;
    width: 100%;
    justify-content: space-around;

    @media (max-width: 315px) {
        margin-bottom: 6em;

        flex-direction: column;
        grid-template-columns: auto;
        grid-template-rows: auto;
    }
    @media (max-width: 2048px) {
        margin-bottom: 6em;
      }
  
      @media (max-width: 768px) {
        margin-bottom: 6em;
   
      }
`
const FormContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    align-content: center;
    justify-content: center;
    padding 2em;
    height: auto;
    width: 100%;
`
const GasCard = styled.div`
      width: 18em;
      height 12em;
      padding: 2em;
      display: flex;
      border-radius: 12px;
      flex-direction: column;
      align-content: center;
      align-items: center;
      align-self: center;
      row-gap: 0.82em;
      justify-content: center;
      background-color: rgba(29, 30, 32, 1);
      border: 1px solid rgba(255, 255, 255, 0.125);
      box-shadow: var(--shadow-elevation-medium);
`


const marketReducer = (state, action) => {
    switch (action.type) {
        case 'stopLossContract': {
            return {
                ...state,
                stopLossContract: action.payload
            }
        }
        case 'openTradeWindow' : {
            return {
                ...state,
                openTradeWindow: !state.openTradeWindow 
            }
        }
        case 'ERROR': {
            return {
                ...state,
                error: action.payload,
                loading: true
            }
        }
        case 'loading': {
            return {
                ...state,
                loading: action.payload
            }
        }
        default:
            return state
    

    }
}

const initialState = {
    loading: true,
    stopLossContract: '',
    error: '',
    openTradeWindow: false,
}





const NFT = () => {
    const [stopLossContract, setStopLossContract] = useState('');
    const {active, account, library, connector} = useWeb3React();
    const [loading, setLoading] = useState(false);
    const [state, dispatch] = useReducer(marketReducer, initialState)
    
    // const [gasTankApproval, setGasTankApproval] = useState(false)
    
    // const [gasTankQueryData, setGasTankQueryData] = useState("")
    // const [gasTankData, setGasTankData] = useState(0)
    
    // const {data: balanceData} = useGraphQuery(gasTankQueryData, "gas-tank")
    const {balanceData, approvalFunction, approval: gasTankApproval} = useFetchGasBalance()

    const openTradeWindowToggle = () => {
        dispatch({ type: 'openTradeWindow'})
    }
    
    // useEffect( () => {
    //     if (account) {
    //         setGasTankQueryData(gasTankQuery(account.toLowerCase()))
    //         console.log("pppppppp", gasTankQueryData)
    //     }
    // }, [account])

    // useEffect( () => {
    //     console.log("balanceData", balanceData)
    //     if (balanceData.payers !== undefined && balanceData.payers[0] !== undefined && balanceData.payers[0].payees.length > 0) {
    //         balanceData.payers[0].payees.map(( payee ) => {
    //             console.log("qqqqqqqq", payee)
    //             if(payee !== undefined && payee.payee.id === addresses.vaults.controller.toLowerCase()) {
    //                 setGasTankApproval(payee.approved)
    //             }
    //         })
    //     }
    //   }, [balanceData])





    
    if (gasTankApproval) {

        
        return (
        <>
        <Page>

            <MarketPageHeading/>
            <HowToSection />

            <LimitOrderEntry state={state} openTradeWindowToggle={openTradeWindowToggle}/>



        </Page>

        </>
        )
    } else {
        return (
            <>
            <Page>

            <MarketPageHeading/>
      
       
                    <GasCard style={{marginTop: "3em", marginBottom: "3em"}}>
                        <GasTank />
                        <SubmitButton onClick={(async () => approveControllerWithGasTank(library.getSigner()))}>Approve Gas Tank</SubmitButton>
                    </GasCard>

            </Page>
    
            </>
            )
    }
}
export default NFT