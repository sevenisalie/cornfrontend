import React, {useState, useEffect} from 'react'
import styled from "styled-components"
import { useWeb3React } from "@web3-react/core";

import {addresses} from "../../../config/addresses"
import {ERC20Abi, quickRouterAbi} from "../../../config/abis"


import {createStopLossTrade, writeContract} from "../../../utils/nft"
import {getUserTokenBalance, getSwapInfo} from "../../../utils/fetchUserData"
import {HeaderButtonSecondary} from "../../vaults/index"

import NavigationBar from "../../../components/NavigationBar"
import {Card, Container, Button, Dropdown, Form} from "react-bootstrap"
import {FiRefreshCcw} from "react-icons/fi"

const RefreshButton = styled(HeaderButtonSecondary)`
    border-radius: 15px;
    height: auto;
    width: auto;
    background: transparent;
    border-color: #fce984;
    border-width: 3px;
    color: #FFFFE0;
    font-size: 20px;
    font-weight: 600;



    &:hover {
        background: rgba(251, 219, 55, 0.2);
        border-color: #dfbb05;
        border-width: 3px;
        color: #dfbb05;
        font-size: 20px;
        font-weight: 800;
       
    }

    &:focus {
        background: rgba(251, 219, 55, 0.3);
        border-color: #dfbb05;
        border-width: 3px;
        color: #dfbb05;
        font-size: 20px;
        font-weight: 800;
        animation:spin 4s linear infinite;
    }

    &:disabled {
        background: transparent;
        border-color: #ffc67a;
        border-width: 3px;
        color: #ffc67a;
        font-size: 20px;
        font-weight: 800;
    }
`

const InfoBox = styled(Card)`
    height: auto;
    width: auto;
    box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
    background: #292C2D;
    font-size: 14px;
    padding: 10px;
    margin-top: 10px;
    border-radius: 20px;
    border-width: 1px;
    border-color: #4e5456;
    align-items: center;

`

const ExchangeRateCard = (props) => {
    const {active, account, library, connector} = useWeb3React();

    const [routerContract, setRouterContract] = useState('')
    const [tokenA, setTokenA] = useState(props.tokenA)
    const [tokenB, setTokenB] = useState(props.tokenB)
    const [tokenADecimals, setTokenADecimals] = useState(props.tokenADecimals)
    const [tokenBDecimals, setTokenBDecimals]= useState(props.tokenBDecimals)
    const [tokenASymbol, setTokenASymbol] = useState(props.tokenASymbol)
    const [tokenBSymbol, setTokenBSymbol]= useState(props.tokenBSymbol)

    const [aPerB, setAPerB] = useState(0)
    const [bPerA, setBPerA] = useState(0)

    useEffect( async () => {
        try {
            const ctr = await writeContract(
                active,
                library.getSigner(),
                account,
                addresses.ROUTER,
                quickRouterAbi
            )
            setRouterContract(ctr)
        } catch (err) {console.log(err)}
       
    }, [account])

    useEffect( () => {
        try {
            setTokenA(props.tokenA)
            setTokenB(props.tokenB)
            setTokenADecimals(props.tokenADecimals)
            setTokenBDecimals(props.tokenBDecimals)
            setTokenASymbol(props.tokenASymbol)
            setTokenBSymbol(props.tokenBSymbol)
            console.log(
                `
                Testing Rate Box
                TokenA: ${tokenASymbol}
                TokenB: ${tokenBSymbol}
                
                `
            )
        } catch (err) {console.log(err)}
        
    }, [props])

    useEffect( async() => {
        try {
            const data = await getSwapInfo(
                tokenA,
                tokenADecimals,
                tokenB,
                tokenBDecimals,
                routerContract
            )
            setAPerB(data.APerB)
            setBPerA(data.BPerA)
            console.log(`
            tokenA: ${tokenA}
            tokenB: ${tokenB}
            tokenADecimals: ${tokenADecimals}
            tokenBDecimals: ${tokenBDecimals}
            A Per B: ${aPerB}
            `)
        } catch (err) {console.log(err)}
        
    }, [tokenBSymbol])

    useEffect( async() => {
        try {
            const data = await getSwapInfo(
                tokenA,
                tokenADecimals,
                tokenB,
                tokenBDecimals,
                routerContract
            )
            setAPerB(data.APerB)
            setBPerA(data.BPerA)
            console.log(`
            tokenA: ${tokenA}
            tokenB: ${tokenB}
            tokenADecimals: ${tokenADecimals}
            tokenBDecimals: ${tokenBDecimals}
            A Per B: ${aPerB}
            `)
        } catch (err) {console.log(err)}
        
    }, [tokenASymbol])


    const handleUpdatePrice = async () => {
        try {
            const data = await getSwapInfo(
                tokenA,
                tokenADecimals,
                tokenB,
                tokenBDecimals,
                routerContract
            )
            setAPerB(data.APerB)
            setBPerA(data.BPerA)
            console.log(`
            tokenA: ${tokenA}
            tokenB: ${tokenB}
            tokenADecimals: ${tokenADecimals}
            tokenBDecimals: ${tokenBDecimals}
            A Per B: ${aPerB}
            `)
        } catch (err) {console.log(err)}
    }


    return (
        <>
            <InfoBox>
            
            <h3 style={{fontSize: "1.4em", color: "#fbdb37", alignSelf: "center", marginBottom: "0px"}}> 
                {bPerA} {tokenBSymbol} Per {tokenASymbol}
                <RefreshButton onClick={async () => handleUpdatePrice()}  style={{marginTop: "0px", marginLeft: "15px" }}>
                <FiRefreshCcw style={{color: "#fbdb37", fontSize: "1.4em"}}/>

                </RefreshButton>

            </h3>
            </InfoBox>
            
        </>
    )
}

export default ExchangeRateCard
