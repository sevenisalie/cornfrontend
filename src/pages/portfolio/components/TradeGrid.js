import React, {useState, useEffect} from 'react'
import styled from "styled-components"
import {request, gql} from "graphql-request"
import { useWeb3React } from "@web3-react/core";
import useGraphQuery from "../../../hooks/useGraphQuery"
import {VAULTS} from "../../../config/vaults"
import { portfolioGraphRequest } from "../../../queries/portfolioQueries"
import { cleanTradeData, viewTransaction, withdraw } from "../../../utils/portfolio"
import { toFixed } from "../../../utils/nft"
import { AiFillEye } from "react-icons/ai"
import { GoSettings } from "react-icons/go"
import { BsArrowBarDown, BsArrowRight, BsChevronRight } from "react-icons/bs"
import { IoRadioButtonOff, IoRadioButtonOn } from "react-icons/io5"
import { Token } from 'graphql/language/ast';

const TradeGridContainer = styled.div`
    display: grid;
    width: 100%;
    height: auto;
    grid-template-columns: auto auto;
    grid-template-rows: auto;
    justify-items: center;
    align-content: start;
    column-gap: 1em;
    row-gap: 4.20em;
    padding: 2.5em;

    @media (max-width: 960px ) {
        grid-template-columns: auto;

    }
`

const TradeCard = styled.div`
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    height: max-content;
    width: max-content;
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
    const {account, library} = useWeb3React()
    const [query, setQuery] = useState("")
    const {data:portfolioData} = useGraphQuery(query, "controller")
    const [tradeData, setTradeData] = useState([])

    useEffect(() => {
        if (account) {
            const q = portfolioGraphRequest(account)
            setQuery(q)
        }
    }, [account])

    useEffect(() => {
        if (portfolioData !== "") {
            const data = mapTrades()
            if(data !== null) {
                const cleanData = cleanTradeData(data)
                console.log("cleanData", cleanData)
                setTradeData(cleanData)
            }
        }
    }, [portfolioData])

    const mapTrades = () => {
        if(portfolioData.users !== undefined && portfolioData.users[0] !== undefined) {
            console.log("portDAta", portfolioData)
            const mappedTrades = portfolioData.users[0].strategyTokens.map( (strategy) => {
                const strat = VAULTS.filter( (vault) => {
                    return vault.pid === parseInt(strategy.strategyId)

                })
        
                const trades = strategy.trades.map( (trade) => {
                    return trade
                })

                const ordersOfTrades = trades.map( (trade) => {
                    const orders = trade.orders.map( (order) => {
                        return order
                    })
                    return orders
                })


                return {
                    strategy: strat[0].name,
                    trades: trades,
                    strategyId: strategy.strategyId,
                    tokenId: strategy.tokenId
    
                }
            } )
            return mappedTrades
        }   
        else {
            return null
        }
    }

    const mapTradesToCards = tradeData.map( ( trade, index ) => {

        return (
        <>
        <Trade trade={trade} key={index}/>
        </>
        )
    })
    


    return (
        <>
        <TradeGridContainer>
            {mapTradesToCards}
        </TradeGridContainer>
        </>
    )
}

export default TradeGrid


const Trade = ({ trade }) => {
    const {account, library} = useWeb3React()
    console.log("god dammit bobby", trade)

    const tokensOpen = trade.trades.map( (trade) => {
        const tokenIns = trade.orders.map( (order) => {
            console.log("TRADER")
            console.log(order)
            return {
                name: order.fromToken[0].symbol,
                image: order.fromToken[0].logoURI
            } 
        })
        const tokenOuts = trade.orders.map( (order) => {
            return {
                name: order.toToken[0].symbol,
                image: order.toToken[0].logoURI
            }
        })



        const tokens = tokenIns.map( (token) => {

            return (
                <>
                <TokenInNameText>{token.name}</TokenInNameText>
                </>
            )
        })
        const images = tokenIns.map( (token) => {
            return (
                <>
                <TokenInImage src={token.image}></TokenInImage>
                </>
            )
        })

        const tokensOutName = tokenOuts.map( (token) => {
            return (
                <>
                <TokenInNameText style={{fontSize: "0.9em", marginLeft: "0.72em"}}>{token.name}</TokenInNameText>
                </>
            )
        })

        const tokensOutImage = tokenOuts.map( (token) => {
            return (
                <>
                <TokenOutImage src={token.image}></TokenOutImage>
                </>
            )
        })
        
        return {
            tokensin: tokens,
            images: images,
            tokensout: tokensOutName,
            imagesout: tokensOutImage
        }

    })

    return (
        <>
        {/* <pre>
            {trade.trades}
        </pre> */}
                <TradeCard>
            <CardContentContainer>
                <CardContentColumnContainer>

                    <CardContentRowContainer>
                        {tokensOpen[0].images[0]}
                        <EyeButton
                        onClick={ (e) => {
                            e.preventDefault()
                            // window.location.href = 'https://polygonscan.com/tx/0x5ac6d82fabe27b6495dea4b38e6fd765da43ffc0f52b8fdd1dfcead2ddaa9f20'
                        }}
                        >
                        </EyeButton>
 
                        <SettingsButton
                        onClick={ (e) => {
                            e.preventDefault()
                            withdraw(trade.strategyId, trade.tokenId, library.getSigner())
                        }}></SettingsButton>
                    </CardContentRowContainer>


                    <CardContentRowContainer>
                        
                            {tokensOpen[0].tokensin[0]}
                        
                        <TokenInIcon></TokenInIcon>
                    </CardContentRowContainer>


                    <CardContentRowContainer>
                        <StrategyTypeText>{trade.strategy}</StrategyTypeText>
                        <TokenOutIcon></TokenOutIcon>
                        {tokensOpen[0].tokensout[0]}
                        {tokensOpen[0].imagesout[0]}
                    </CardContentRowContainer>
                    {/* <p>
            
                        {trade.strategyId}
                        {trade.tokenId}
                    </p> */}


                    <TradeHR></TradeHR>
                    

                    { trade.trades.map( (trade => {
                        return trade.orders.map( (order => {
                            console.log("orderData", order)
                            return (
                                <>
                                <CardContentRowContainer>

                                <TradePriceText>{order.amountIn}</TradePriceText>
                                <TradePriceTokenLogo src={order.fromToken[0].logoURI} />
                                <PathIcon></PathIcon>
                                <TradePriceText>{toFixed((order.open ? order.desiredAmountOut : order.amountOut), 3)}</TradePriceText>
                                <TradePriceTokenLogo src={order.toToken[0].logoURI} />
                                {
                                    order.open === true
                                    ?
                                    <IoRadioButtonOff style={{marginLeft: "1.82em", fontSize: "1.3em" }} />
                                    :
                                    <IoRadioButtonOn style={{marginLeft: "1.82em", fontSize: "1.3em" }} />
                                }
                                </CardContentRowContainer>
                                </>
                            )
                        }))
                    }))}
                </CardContentColumnContainer>
            </CardContentContainer>
        </TradeCard>
        </>
    )
}