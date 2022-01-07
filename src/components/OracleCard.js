import React, {useEffect, useState} from 'react'
import {ethers} from "ethers";
import styled from "styled-components"
import {Button, Container, Card} from "react-bootstrap"
import {aggregatorV3InterfaceABI} from "../config/abis"
import {addresses} from "../config/addresses"
import {writeContract, fetchPoolAllowance, getTokenStakeBalance, fetchTokenStakeBalance} from "../utils/nft";
import {fetchUserPoolData, mapPendingToOriginalData, getPoolBalance} from "../utils/fetchUserData";
import { useWeb3React } from "@web3-react/core";
import {stringToFixed} from "../utils/nft"

import {BsApple} from "react-icons/bs"

const OracleCardRow = styled(Container)`
    display: grid;
    grid-template-columns: 1.1fr 1.1fr; 
    grid-template-rows: 1.6fr 0.4fr 1fr; 
    gap: 4px 9px; 
    margin-top: 10px;
    height: auto;
    width: auto;
    margin-bottom: 10px;
    align-items: center;
    align-content: center;
`
const OracleCardColumn = styled(Container)`
    display: flex;
    flex-direction; column;
    align-items: center;
    align-content: center;
    height: auto;
    width: auto;
`

const AssetCard = styled(Card)`
    border: 0px;
    margin-top: 10px;
    margin-bottom: 10px;
    height: auto;
    width: auto;
    border-radius: 22px;
    backdrop-filter: blur(12px) saturate(149%);
    -webkit-backdrop-filter: blur(0px) saturate(149%);
    background-color: rgba(29, 30, 32, 0.57);
    border: 1px solid rgba(255, 255, 255, 0.125);
    box-shadow: 6px 6px 8px 0 rgba(0, 0, 0, 0.3);
`
const OracleCardHeader = styled.div`
    justify-text: center;
    font-size: 1.5em;
    font-weight: 600;
    color: #fbdb37;
    
`

const LastPrice = styled.div`
    justify-text: center;
    font-size: 1.0em;
    font-weight: 400;
    color: #fbfbfb;
`

const OracleCard = (props) => {
    const {active, account, library, connector} = useWeb3React()
    console.log(`
        TYPE
        ${typeof(props.price)}
    `)
    
    return (
        <>
        <AssetCard>
            <OracleCardRow>
                    <img style={{height: "3.5em", width: "auto", marginRight: "12px"}} src={'/assets/images/CornLogo.png'}></img>
                    <h3 style={{marginBottom: "0px"}}>{props.symbol}</h3>

                   <OracleCardHeader>Last</OracleCardHeader>
                   <OracleCardHeader>Current</OracleCardHeader>

                   <LastPrice>{stringToFixed(props.price, 5)}</LastPrice>
                   
             
                   <div>23434.34</div>
                   
                    
                    
              
            </OracleCardRow>
     

        </AssetCard>
            
        </>
    )
}

export default OracleCard
