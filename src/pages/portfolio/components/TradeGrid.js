import React from 'react'
import styled from "styled-components"

import { AiFillEye } from "react-icons/ai"
import { GoSettings } from "react-icons/go"
import { BsArrowBarDown, BsArrowRight, BsChevronRight } from "react-icons/bs"

const TradeGridContainer = styled.div`
    display: grid;
    width: 100%;
    height: auto;
    grid-template-columns: auto auto auto;
    grid-template-rows: auto;
    justify-items: center;
    align-content: start;
    column-gap: 1em;
    row-gap: 4.20em;
    padding: 2.5em;
`

const TradeCard = styled.div`
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    height: 258px;
    width: 100%;
    margin-top: 2px;
    margin-bottom: 2px;
    background: url(/assets/images/opentradebg.png) no-repeat center center fixed; 
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
`
const CardContentContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 80%;
    height: 100%;
    backdrop-filter: blur(12px) saturate(149%);
    -webkit-backdrop-filter: blur(0px) saturate(149%);
    background-color: rgba(29, 30, 32, 1);
    border: 1px solid rgba(255, 255, 255, 0.125);
    box-shadow: var(--shadow-elevation-medium);
`
const CardContentColumnContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    row-gap: 4px;
    padding: 1em;
    align-items: center;
    align-content: center;
    justify-content: space-evenly;
`

const CardContentRowContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: auto;
    align-items: center;
    align-content: center;
`

const TokenInImage = styled.img`
    height: 2.1em;
    width: auto;
    align-self: flex-start;
`
const TokenOutImage = styled.img`
    height: 2.1em;
    width: auto;
    align-self: flex-start;
    margin-left: auto;
    margin-right: 6.5em;
    justify-self: center;
`
const TokenInNameText = styled.div`
    font-size: 1.8em;
    font-weight: 600;
    color: rgba(242, 242, 242, 0.9);
    justify-self: flex-end;
`
const TokenInIcon = styled(BsArrowBarDown)`
    font-size: 1.3em;
    font-weight: 800;
    color: rgba(242, 242, 242, 0.6);
    margin-left: 1.5em;
`
const TokenOutIcon = styled(BsArrowRight)`
    font-size: 1.3em;
    font-weight: 800;
    color: rgba(242, 242, 242, 0.6);
    margin-left: 1.5em;
`
const PathIcon = styled(BsChevronRight)`
    font-size: 1em;
    font-weight: 400;
    color: rgba(242, 242, 242, 0.6);
    margin-left: 0.5em;
`
const EyeButton = styled(AiFillEye)`
    font-size: 1.3em;
    align-self: center;
    margin-left: auto;
    margin-right: 0.1em;
    cursor: pointer;
`
const SettingsButton = styled(GoSettings)`
    font-size: 1.3em;
    align-self: center;
    margin-left: 0.1em;
    cursor: pointer;
`
const StrategyTypeText = styled.div`
    font-size: 1.4em;
    color: rgba(242, 242, 242, 0.7);
    font-weight: 600;
    justify-self: center;
`
const TradeHR = styled.hr`
   
    width: 70%;
    margin-right: auto;
    margin-left: 0.1em;;
    size: 3px;
    color: rgba(242, 242, 242, 1);
    margin-top: 0px;
    margin-bottom: 0px;
`
const TradePriceText = styled.div`
    font-size: 1em;
    color: rgba(242, 242, 242, 0.8);
    font-weight: 400;
    margin-left: 0.5em;
    margin-right: 0.5em;
`
const TradePriceTokenLogo = styled.img`
    width: auto;
    height: 1.3em;
`

const TradeGrid = () => {
    const mockTrades = ["LIMIT", "LIMIT", "LIMIT", "LIMIT", "LIMIT", "LIMIT", "LIMIT", "LIMIT", "LIMIT"]
    const trades = mockTrades.map(( trade ) => (
        <TradeCard>
            <CardContentContainer>
                <CardContentColumnContainer>

                    <CardContentRowContainer>
                        <TokenInImage src={"https://etherscan.io/token/images/aave_32.png"} /> 
                        <EyeButton ></EyeButton>
                        <SettingsButton></SettingsButton>
                    </CardContentRowContainer>


                    <CardContentRowContainer>
                        <TokenInNameText>AAVE</TokenInNameText>
                        <TokenInIcon></TokenInIcon>
                    </CardContentRowContainer>


                    <CardContentRowContainer>
                        <StrategyTypeText>Limit</StrategyTypeText>
                        <TokenOutIcon></TokenOutIcon>
                        <TokenOutImage src={"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"}></TokenOutImage>
                    </CardContentRowContainer>


                    <TradeHR></TradeHR>
                    
                    <CardContentRowContainer>
                        <TradePriceText>1</TradePriceText>
                        <TradePriceTokenLogo src={"https://etherscan.io/token/images/aave_32.png"} />
                        <PathIcon></PathIcon>
                        <TradePriceText>69.00</TradePriceText>
                        <TradePriceTokenLogo src={"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"} />
                    </CardContentRowContainer>

                </CardContentColumnContainer>
            </CardContentContainer>
        </TradeCard>
    ))
    return (
        <>
        <TradeGridContainer>
            {trades}
        </TradeGridContainer>
        </>
    )
}

export default TradeGrid
