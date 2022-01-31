import React, {useReducer, useEffect, useState} from 'react'
import axios from "axios"
import {ethers} from "ethers";
import styled from "styled-components";
import {POOLS} from "../../../config/pools";
import TOKENLIST from "../../../config/TOKENLIST.json"
import {addresses} from "../../../config/addresses";
import {ORDERTYPES} from "../../../config/ordertypes"



import {Container} from "react-bootstrap";
import {FaTimesCircle, FaWallet} from "react-icons/fa"
import {AiOutlinePlusCircle} from "react-icons/ai"
import {BiDownArrow} from "react-icons/bi"


import CornLogo from "../../../assets/images/CornLogo.png"


const EntryContainer = styled.div`
    position: relative;
    max-width: 480px;
    width: 100%;
    backdrop-filter: blur(12px) saturate(149%);
    -webkit-backdrop-filter: blur(0px) saturate(149%);
    background-color: rgba(29, 30, 32, 0.57);
    border: 1px solid rgba(255, 255, 255, 0.125);
    box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;
    border-radius: 24px;
    margin-top: 1rem;
`

const TitleContainer = styled.div`
    display: flex;
    width: 100%;
    height: auto;
    align-items: center;
    align-text: center;
    margin-bottom: 1rem;
    padding: 1rem 1.25rem 0.5rem;
    justify-content: space-between;
`

const TitleTextContainer = styled.div`
    box-sizing: border-box;
    margin: 0px;
    min-width: 0px;
    display: flex;
    padding: 0px;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: start;
    justify-content: flex-start;
    width: fit-content;
`
const TitleText = styled.h3`
    box-sizing: border-box;
    margin: 0px;
    min-width: 0px;
    font-weight: 500;
    font-size: 16px;
    color: #fbdb37 !important;
    align-self: center;
`
const CloseButtonContainer = styled.div`
    display: flex;
    padding: 3px;
    align-content: center;
    justify-content: center;
`
const CloseButton  = styled.button`
    text-align: center;
    text-decoration: none;
    display: flex;
    flex-wrap: nowrap;
    z-index: 1;
    will-change: transform;
    transition: transform 450ms ease 0s;
    background-color: transparent;
    outline: none;
    cursor: pointer;
    user-select: none;
    border: none;

    &:select {
        -webkit-animation: rotate-out-center 0.6s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
        animation: rotate-out-center 0.6s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
    }

`

const OrderContainer = styled.div`
    box-sizing: border-box;
    min-width: 0px;
    width: 100%;
    display: flex;
    padding: 0px;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: start;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin: -4px;
    margin-bottom: 8px;
    padding: 1rem 1.25rem 0.5rem;

`
//AMTOKENBUTTON

const OrderButtonContainer = styled.div`
    display: flex;
    padding: 2px;
    margin: 2px 2px 2px 2px;
`
const OrderButton = styled.button`
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
    font-size: 24px;
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
const ButtonContentContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
`
const OrderSelectLogoContainer = styled.div`
    box-sizing: border-box;
    margin: 0px;
    min-width: 0px;
    display: flex;
    padding: 0px;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: start;
    justify-content: flex-start;
    width: fit-content;
`
const OrderImage = styled.img`
    height: 28px;
    width: 28px;
    margin: 2px 2px 2px 2px;
    box-shadow: rgb(0 0 0 / 8%) 0px 6px 10px;

`
const OrderText = styled.h3`
    box-sizing: border-box;
    align-text: center;
    margin-left: 8px;
    min-width: 0px;
    font-weight: 500;
    font-size: 20px;
    color: #fbfbfb !important;
    align-self: center;
    justify-self: center;
    margin-bottom: 0px;
    margin-right: 4px;
`
const OrderHeaderContainer = styled.div`
    display: flex;
    width: 100%
    height: auto;
    justify-content: space-between;
    color: #fbfbfb;
    font-size: 16px;
    padding: 1rem 1.25rem 0.5rem;

`

//SCROLL RESULTS

const ScrollEntryContainer = styled.div`
    display:flex;
    flex: 1 1 0%;
    position: relative;
    border-top: 3px solid rgb(64, 68, 79);

`
const SecretContainer = styled.div`
    overflow: auto;
    height: 200px;
    maxHeight: 100px;
    width: 100%;
`

const ResultContainer = styled.div`
    display: flex;
    height: auto;
    width: 100%;
    justify-content: space-between;
    padding: 8px;
    border-top: 1px solid rgb(64, 68, 79);
    `


export const OrderTypeButton = (props) => {

    const handleOrderToggle = () => {
    
        props.setOrderType(props.data)
     
    }

    return (
        <>
            <OrderButtonContainer>

                <OrderButton onClick={handleOrderToggle}>
                    <ButtonContentContainer>
                        <OrderSelectLogoContainer>
                            <AiOutlinePlusCircle />
                            <OrderText>{props.symbol}</OrderText>
                        </OrderSelectLogoContainer>
                    </ButtonContentContainer>
                </OrderButton>
            </OrderButtonContainer>
        </>
    )
}


const OrderSelector = (props) => {

    const orderTypeMap = ORDERTYPES.map( (order) => (
        <OrderTypeButton setOrderType={props.setOrderType} data={order} imageurl={order.image} symbol={order.name}/>
    ))

    return (
        <>
           <EntryContainer>
                <TitleContainer>
                    <TitleTextContainer>
                        <TitleText>Select Order Type</TitleText>
                    </TitleTextContainer>
                    <CloseButtonContainer>
                        <CloseButton onClick={props.openOrderSelectorToggle}>
                        <FaTimesCircle style={{color: "#fbdb37", fontSize: "1.8em"}} />
                        </CloseButton>
                    </CloseButtonContainer>
                </TitleContainer>


                <OrderHeaderContainer>
                    Common Order Types
                </OrderHeaderContainer>
                <OrderContainer>
                    {orderTypeMap}
                </OrderContainer>

                <ScrollEntryContainer>
                    <SecretContainer>
                        <OrderSearch
                        setOrderType={props.setOrderType}
                        >
                    </OrderSearch>                        
                    </SecretContainer>
                </ScrollEntryContainer>

            </EntryContainer> 
        </>
    )
}

export default OrderSelector



const OrderSearch = (props) => {
 

        const SearchResultsMap = ORDERTYPES.map( (order) => (
            <>
             <ResultContainer>
                 <OrderTypeButton setOrderType={props.setOrderType} data={order} imageurl={order.image} symbol={order.name}></OrderTypeButton>
             </ResultContainer>
             </>
     ))
    




    return (
        <>
        <ScrollEntryContainer>
            <SecretContainer>
                {SearchResultsMap}                         
            </SecretContainer>
        </ScrollEntryContainer>
        </>
    )
}
