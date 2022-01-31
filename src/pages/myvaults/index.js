import LIMITABI from "../../config/contracts/LimitOrderVault.json"
import STOPABI from "../../config/contracts/StopLossVault.json"
import ACCDISTABI from "../../config/contracts/AccumulatorDistributorVault.json"
import styled from "styled-components";
import {Page} from "../../components/Page"
import {ethers} from "ethers";
import React, {useEffect, useState, useReducer} from "react";
import { useWeb3React } from "@web3-react/core";
import { addresses } from "../../config/addresses";
import { nftURI } from "../../config/uri";
import BackdropFilter from "react-backdrop-filter";
//abis

import axios from "axios"
import {nftABI, stopLossAbi} from "../../config/abis";
import {Container, Card, Button} from "react-bootstrap";
import {writeContract, userMint} from "../../utils/nft";
import {VaultNFTCard} from "./components/VaultNFTCard";
import VaultsPageHeading from "./components/VaultsPageHeading"
import {OracleBar} from "../../components/OracleBar";
import {VaultNFTFooter} from "./components/VaultNFTFooter";
import VaultSelector from "./components/VaultSelector"
import {Chart} from "./components/Chart";
import TokenSelector from "../nftgallery/components/TokenSelector"
import {OrderTypeButton} from "../nftgallery/components/OrderSelector"
import OrderSelector from "../nftgallery/components/OrderSelector"

import Marquee from "react-fast-marquee";
import {MultiplierBadge} from "../pools/components/Badges"
import {FaCircle, FaRegCircle, FaTicketAlt} from "react-icons/fa"
import {BiDownArrow} from "react-icons/bi"


import {EthIcon, BitcoinIcon, DollarIcon} from "../nftgallery/components/CreateVault"



const MyVaultContainer = styled(Container)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-top: 40px;
`

const VaultGrid = styled(Container)`
    margin-top: 25px;
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: 100%;
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

const MyVaultCard = styled(Card)`
    padding: 10px;
    border-radius: 50px;
    position: relative;
    border-color: transparent;
    z-index: 0;
    height: auto;
    width: 100%;
    backdrop-filter: blur(12px) saturate(149%);
    -webkit-backdrop-filter: blur(0px) saturate(149%);
    background-color: rgba(29, 30, 32, 0.57);
    border: 1px solid rgba(255, 255, 255, 0.125);
    box-shadow: 12px 12px 16px 0 rgba(0, 0, 0, 0.3);
    width: 100%;

`
const OrderCard = styled(Card)`
    border-radius: 25px;
    height: 100%;
    width: 100%;
    backdrop-filter: blur(12px) saturate(149%);
    -webkit-backdrop-filter: blur(0px) saturate(149%);
    background-color: rgba(29, 30, 32, 0.57);
    border: 1px solid rgba(255, 255, 255, 0.125);
    box-shadow: 6px 6px 8px 0 rgba(0, 0, 0, 0.3);
`
const CardGrid = styled(Container)`
    margin-top: 25px;
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: 100%;
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

const HeaderContainer = styled.div`
    display: grid;
    padding: 0.4em;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 1fr;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
    place-items: center;
`

const SelectButton = styled.button`
    text-align: center;
    text-decoration: none;
    display: flex;
    flex-wrap: nowrap;
    position: relative;
    z-index: 1;
    will-change: transform;
    transition: transform 450ms ease 0s;
    transform: perspective(1px) translateZ(0px);
    -webkit-box-align: center;
    align-items: center;
    font-size: 1.2em;
    font-weight: 500;
    backdrop-filter: blur(12px) saturate(149%);
    -webkit-backdrop-filter: blur(0px) saturate(149%);
    background-color: rgba(29, 30, 32, 0.57);
    border: 1px solid rgba(255, 255, 255, 0.125);
    box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;

    color: rgb(255, 255, 255);
    border-radius: 16px;

    outline: none;
    cursor: pointer;
    user-select: none;
    height: 2.8rem;
    width: initial;
    padding: 0px 8px;
    -webkit-box-pack: justify;
    justify-content: space-between;
    margin-right: 3px;


    &:hover {
        background-color: rgb(44, 47, 54);
    }
    &:focus {
        background-color: rgb(33, 35, 40);
    }
`

const TokenSelectorOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .5);
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
`

const OrdersCard = (props) => {
  

        
        return (
            <>
        
        
                <MyVaultContainer>
                    <VaultGrid>
                        <MyVaultCard>
                            <CardGrid>
    
                                <OrderCard>
                                    <HeaderContainer>
                                        <SelectButton onClick={props.toggleTokenSelector} style={{justifySelf: 'start'}}>
                                            {props.state.token !== '' ? props.state.token.symbol : 'Select Token'}
                                            <BiDownArrow  style={{marginLeft: "0.2em"}}/>
                                        </SelectButton>
                                        <SelectButton onClick={props.toggleOrderSelector} style={{justifySelf: 'end'}}>
                                        {props.state.orderType !== '' ? props.state.orderType.name : 'Select Order Type'}
                                            <BiDownArrow  style={{marginLeft: "0.2em"}}/>
                                        </SelectButton>
                                    </HeaderContainer>
                                </OrderCard>
                       
                                <Chart/>
                            
                            </CardGrid>
                        </MyVaultCard>
                
                    </VaultGrid>
                </MyVaultContainer>


                
         
    
            </>
        )
}


const openOrderReducer = (state, action) => {
    switch (action.type) {
        case 'token': {
            return {
                ...state,
                token: action.payload,
                toggleTokenSelector: !state.toggleTokenSelector

            }
        }
        case 'toggleTokenSelector': {
            return {
                ...state,
                toggleTokenSelector: !state.toggleTokenSelector
            }
        }
        case 'orderType': {
            return {
                ...state,
                orderType: action.payload,
                toggleOrderSelector: !state.toggleOrderSelector

            }
        }
        case 'toggleOrderSelector': {
            return {
                ...state,
                toggleOrderSelector: !state.toggleOrderSelector
            }
        }
    } 
}

const initialState = {
    token: '',
    toggleTokenSelector: false,
    orderType: '',
    toggleOrderSelector: false,
}

const Vaults = () => {

    const [state, dispatch] = useReducer(openOrderReducer, initialState)
    const {active, account, library, connector} = useWeb3React();


    const setToken = (_token) => {
        dispatch({ type: 'token', payload: _token })
    }

    const setOrder= (_orderType) => {
        dispatch({ type: 'orderType', payload: _orderType })
    }

    const toggleTokenSelector = () => {
        dispatch({ type: 'toggleTokenSelector' })
        console.log(state)
    }

    const setToggleOrderSelector = () => {
        dispatch({ type: 'toggleOrderSelector' })
        console.log(state)

    }

    //VAULTS

    



    //TRADES

 


    


        return (
            <>
            <Page>
    
                <VaultsPageHeading />

                
                
                <OrdersCard toggleTokenSelector={toggleTokenSelector} toggleOrderSelector={setToggleOrderSelector} state={state}/>
                
                            {/* popups */}


            {state.toggleTokenSelector == true &&
                
                <TokenSelectorOverlay>
                    <TokenSelector side={'in'} setTokenIn={setToken} setTokenOut={setToken} state={state} openTokenSelectorToggle={toggleTokenSelector}/>
                </TokenSelectorOverlay>
                
            
            }

            {state.toggleOrderSelector == true &&
                
                <TokenSelectorOverlay>
                    <OrderSelector setOrderType={setOrder} state={state} openOrderSelectorToggle={setToggleOrderSelector}/>
                </TokenSelectorOverlay>
 
            }     
        
            </Page>
    
            </>
        )

    
}

export default Vaults
