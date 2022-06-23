
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



import {NFTCard} from "./components/NFTCard";
import MarketPageHeading from "./components/MarketPageHeading";
import LimitOrderEntry from './components/LimitOrderEntry'

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
    width: 100%;
    height: 100px;
    margin-top: 200px;
    margin-bottom: 100px;
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
    display: grid;
    grid-auto-rows: auto;
    row-gap: 0.25em;
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
    

    

    
    const openTradeWindowToggle = () => {
        dispatch({ type: 'openTradeWindow'})
    }
    
    const gasTankApproval = false

    if (gasTankApproval) {

        const mapUserNFTs = NFTS.map((nft, index) => (

            <NFTCard
                state={state}
                contract = {state.stopLossContract}
                id={index}
                nftId={nft.id}
                image={null}
                title={nft.name}
            ></NFTCard>
 
        ));


        
        return (
        <>
        <Page>

            <MarketPageHeading/>


            <LimitOrderEntry state={state} openTradeWindowToggle={openTradeWindowToggle}/>



        </Page>

        </>
        )
    } else {
        return (
            <>
            <Page>

            <MarketPageHeading/>
                <MainContainer>
                    <FormContainer>
                    <SubmitButton onClick={async () => await approveControllerWithGasTank(library.getSigner())}>
                        Approve Gas Tank
                    </SubmitButton>
                    </FormContainer>
                </MainContainer>
            </Page>
    
            </>
            )
    }
}
export default NFT