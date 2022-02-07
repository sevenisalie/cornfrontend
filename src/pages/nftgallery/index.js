
import styled from "styled-components";
import {Page} from "../../components/Page"
import {ethers} from "ethers";
import React, {useEffect, useState, useReducer} from "react";
import { useWeb3React } from "@web3-react/core";
import { addresses } from "../../config/addresses";
import { nftURI } from "../../config/uri";
import {MasterChefABI, ERC20Abi} from "../../config/abis";
import {NFTS} from "../../config/nfts"
import {POOLS} from "../../config/pools"


import axios from "axios"
import {stopLossAbi} from "../../config/abis";
import {Container, Card, Button} from "react-bootstrap";
import {writeContract, userMint} from "../../utils/nft";
import { StyledDetailsButton } from "../../pages/pools/components/PoolCard"
import {HiChevronDoubleUp, HiChevronDoubleDown} from "react-icons/hi"

import {EthIcon, BitcoinIcon, DollarIcon} from "./components/CreateVault"

import {NFTFooter} from "./components/NFTFooter";
import {NFTCard} from "./components/NFTCard";
import MarketPageHeading from "./components/MarketPageHeading";
import LimitOrderEntry from './components/LimitOrderEntry'
import TokenSelector from "./components/TokenSelector"
import useFetchPoolData from "../../hooks/useFetchPoolData"


const MyNFTContainer = styled(Container)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 40px;
    margin-top: 40px;
    margin-bottom: 40px;
`

const MyNFTGrid = styled(Container)`
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
    const {state: data} = useFetchPoolData(account)

    const [state, dispatch] = useReducer(marketReducer, initialState)
    



    

    useEffect( () => {
        if (active) {
            const nftctr = writeContract(
                active,
                library.getSigner(),
                account,
                addresses.vaults.stopVault,
                stopLossAbi,
            )
            .then( value => {
                dispatch({ type: 'stopLossContract', payload: value})
      
                
            })
            
        } else {
            dispatch({ type: 'ERROR', payload: 'poop'})
        }
    }, [active, account])


    

    
    const openTradeWindowToggle = () => {
        dispatch({ type: 'openTradeWindow'})
    }
    
  

    if (loading == false) {

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

            {/* <pre>
                {JSON.stringify(data, null, 2)}
            </pre> */}

            <LimitOrderEntry state={state} openTradeWindowToggle={openTradeWindowToggle}/>



        </Page>

        </>
        )
    } else {
        return (
            <>
            <Page>

            <MarketPageHeading/>

    
                <MyNFTContainer>
    
                    No NFTs :(
               
                </MyNFTContainer>
    
            </Page>
    
            </>
            )
    }
}
export default NFT