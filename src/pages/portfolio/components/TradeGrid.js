import React, {useState, useEffect} from 'react'
import styled from "styled-components"
import {request, gql} from "graphql-request"
import { useWeb3React, ethers } from "@web3-react/core";
import useGraphQuery from "../../../hooks/useGraphQuery"
import {VAULTS, ALL_VAULTS} from "../../../config/vaults"
import { portfolioGraphRequest, portfolioGraphRequestClosed, oracleQuery } from "../../../queries/portfolioQueries"
import { cleanTradeData, viewTransaction, withdraw } from "../../../utils/portfolio"
import { toFixed } from "../../../utils/nft"
import { AiFillEye } from "react-icons/ai"
import { GoSettings } from "react-icons/go"
import { BsArrowBarUp, BsArrowBarDown, BsArrowRight, BsChevronRight } from "react-icons/bs"
import { IoRadioButtonOff, IoRadioButtonOn } from "react-icons/io5"
import { Token } from 'graphql/language/ast';
import {goodToast} from "../../../components/Toast"
import useFetchRouterInfo from '../../../hooks/useFetchRouterInfo';
import { addresses } from '../../../config/addresses';
import {useRefresh} from "../../../utils/useRefresh"

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
    border: 1px solid rgba(255, 255, 255, 0.125);
    @media (max-width: 1200px ) {
        grid-template-columns: auto;

    }

    // border: 3px solid rgba(255, 255, 255, 1);
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

    // border: 3px solid rgba(255, 255, 255, 1);

    
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

    // border: 3px solid rgba(255, 255, 255, 1);
`
const CardContentColumnContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 500px;
    height: 100%;
    row-gap: 4px;
    padding: 1em;
    align-items: center;
    align-content: center;
    justify-content: space-evenly;

    // border: 3px solid rgba(255, 255, 255, 1);
`

const CardContentRowContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: auto;
    align-items: center;
    align-content: center;

    // border: 3px solid rgba(255, 255, 255, 1);
`

const CardContentRowContainerButton = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: auto;
    align-items: center;
    align-content: center;
    cursor: pointer;
`

const CardContentRowContainerSmallText = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: auto;
    align-items: center;
    align-content: center;
    font-size: 0.7em;
    color: rgba(242, 242, 242, 0.9);
    cursor: pointer;
`
const CardContentRowContainerSmallTextItalic = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: auto;
    align-items: center;
    align-content: center;
    font-size: 0.7em;
    color: rgba(242, 242, 242, 0.9);
    cursor: pointer;
    font-style: italic;
    font-weight: bold;
    margin-top: 1em;
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
    margin-left: 0.5em;
    margin-right: 6.5em;
    justify-self: center;
`
const TokenInNameText = styled.div`
    font-size: 1.8em;
    font-weight: 600;
    color: rgba(242, 242, 242, 0.9);
    justify-self: flex-end;
`

const RadioButtonOn = styled(IoRadioButtonOn)`
    cursor: pointer;
`
const WithdrawIcon = styled(BsArrowBarUp)`
    font-size: 1.3em;
    font-weight: 800;
    color: rgba(242, 242, 242, 0.6);
    margin-left: 0.5em;
    cursor: pointer;
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
    color: rgba(242, 242, 242, 0.7);
    margin-top: 0px;
    margin-bottom: 0px;
`

const TradeHRFull = styled.hr`
    border: none;
    border-top: double #FFF;
    color: #333;
    overflow: visible;
    text-align: center;
    height: 5px;
    width: 90%;
    margin-right: auto;
    margin-left: 0.1em;;
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





const TradeGrid = (props) => {
    const {account, library} = useWeb3React()
    const [query, setQuery] = useState("")
    const {data:portfolioData} = useGraphQuery(query, "controller")
    const [tradeData, setTradeData] = useState([])
    const [refreshTrigger, setRefreshTrigger] = useState(false)

    useEffect(() => {
        if (account) {
            if(props.tradeStatus) {
                const q = portfolioGraphRequest(account)
                setQuery(q)
            }
            else {
                const q = portfolioGraphRequestClosed(account)
                setQuery(q)
            }
        }
    }, [account, refreshTrigger, props.tradeStatus])

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
                const strat = ALL_VAULTS.filter( (vault) => {
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
                console.log("strat", strategy)

                return {
                    strategy: strat[0].name,
                    trades: trades,
                    strategyId: strategy.strategyId,
                    tokenId: strategy.tokenId,
                    txHash: strategy.txHash
    
                }
            } )
            console.log("mappedTrades", mappedTrades)
            return mappedTrades
        }   
        else {
            return null
        }
    }

    const mapTradesToCards = tradeData.map( ( trade, index ) => {

        return (
        <>
        <Trade setRefreshTrigger={setRefreshTrigger} trade={trade} key={index}/>
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


const Trade = ({ trade, setRefreshTrigger }) => {
    const {account, library} = useWeb3React()
    const [desiredRate, setDesiredRate] = useState(false)
    const [fillRate, setFillRate] = useState(true)
    const {data:oracleData} = useGraphQuery(oracleQuery(), "oracle")
    const [priceData, setPriceData] = useState()

    const { fastRefresh, slowRefresh } = useRefresh()

    
    useEffect(() => {
      setPriceData(oracleData)
      console.log("oracleData", priceData)
    //   getRate(trade.trades[0].orders[0].fromToken[0].address, trade.trades[0].orders[0].toToken[0].address)
    }, [oracleData, fastRefresh])
    

    console.log("god dammit bobby", trade)

    const getRate = (from, to) => {
        console.log("oracleDataaa", priceData)
        if(priceData !== undefined) {
            console.log("whyGod", priceData.erc20S)
            try {
                const fromToken = priceData.erc20S.find(e => e.id === from.toLowerCase()).priceUSD
                const toToken = priceData.erc20S.find(e => e.id === to.toLowerCase()).priceUSD
                console.log("rates", fromToken, from.toLowerCase(), toToken)
                return fromToken / toToken
            } catch(err) {
                console.log("getRateError", err)
            }
        }
    }

    // const rates = getRate(trade.trades[0].orders[0].fromToken[0].address, trade.trades[0].orders[0].toToken[0].address)

    
    const tokensOpen = trade.trades.map( (_trade) => {
        const tokenIns = _trade.orders.map( (order) => {
            console.log("TRADER")
            console.log(order)
            return {
                name: order.fromToken[0].symbol,
                image: order.fromToken[0].logoURI
            } 
        })
        const tokenOuts = _trade.orders.map( (order) => {
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
                        title="View Trade Creation"
                        onClick={ (e) => {
                            e.preventDefault()
                            window.open(`https://polygonscan.com/tx/${trade.txHash}`, '_blank')
                        }}
                        >
                        </EyeButton>
 
                        <WithdrawIcon
                        title="Withdraw Trade"
                        onClick={ async (e) => {
                            e.preventDefault()
                            const tx = await withdraw(trade.strategyId, trade.tokenId, library.getSigner())
                            if(tx === null) {
                                goodToast(`Trade Withdrawn`)
                                setRefreshTrigger(prev => !prev)
                            } 
                        }}></WithdrawIcon>
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
    
                    {/* <TradeHRFull></TradeHRFull> */}
                    <CardContentRowContainerSmallTextItalic onClick={(() => setDesiredRate(prev => !prev))}>
                        {`Current Rate: 
                        ${
                            desiredRate == false ? toFixed(getRate(trade.trades[0].orders[0].fromToken[0].address, trade.trades[0].orders[0].toToken[0].address), 5) : 
                            toFixed(getRate(trade.trades[0].orders[0].toToken[0].address, trade.trades[0].orders[0].fromToken[0].address), 5)
                        }
                        ${
                            desiredRate == false ? `${trade.trades[0].orders[0].toToken[0].symbol} / ${trade.trades[0].orders[0].fromToken[0].symbol}` : 
                            `${trade.trades[0].orders[0].fromToken[0].symbol} / ${trade.trades[0].orders[0].toToken[0].symbol}`
                        }
                        `}
                    </CardContentRowContainerSmallTextItalic>
                    <TradeHRFull></TradeHRFull>
                    

                    { trade.trades.map( (trade => {
                        return trade.orders.map( (order, index) => {
                            console.log("orderData", order)
                            return (
                                <>
                                <CardContentRowContainerButton 
                                title="View Order"
                                onClick={ (e) => {
                                        e.preventDefault()
                                        if(!order.open && order.amountOut != 0) {
                                            window.open(`https://polygonscan.com/tx/${order.txHash}`, '_blank')
                                        }
                                }}>

                                <TradePriceText>{order.amountIn}</TradePriceText>
                                <TradePriceTokenLogo src={order.fromToken[0].logoURI} />
                                <PathIcon></PathIcon>
                                <TradePriceText>{toFixed(((order.open || order.amountOut == 0) ? order.desiredAmountOut : order.amountOut), 5)}</TradePriceText>
                                <TradePriceTokenLogo src={order.toToken[0].logoURI} />
                                {
                                    (order.open === true || order.amountOut == 0)
                                    ?
                                    <IoRadioButtonOff style={{marginLeft: "1.82em", fontSize: "1.3em" }} />
                                    :
                                    <RadioButtonOn style={{marginLeft: "1.82em", fontSize: "1.3em" }} />
                                }
                                </CardContentRowContainerButton>
                                <CardContentRowContainerSmallText></CardContentRowContainerSmallText>
                                <CardContentRowContainerSmallText onClick={(() => setDesiredRate(prev => !prev))}>
                                    {`Limit Rate: 
                                    ${desiredRate ? toFixed(order.amountIn/order.desiredAmountOut, 6) : toFixed(order.desiredAmountOut/order.amountIn, 6)} 
                                    ${desiredRate ? `${order.fromToken[0].symbol} / ${order.toToken[0].symbol}` : `${order.toToken[0].symbol} / ${order.fromToken[0].symbol}`}`}
                                </CardContentRowContainerSmallText>

                                <CardContentRowContainerSmallText onClick={(() => setDesiredRate(prev => !prev))}>
                                    Fill Rate: 
                                    {order.amountOut > 0 && `
                                    ${desiredRate ? toFixed(order.amountIn/order.amountOut, 6) : toFixed(order.amountOut/order.amountIn, 6)} 
                                    ${desiredRate ? `${order.fromToken[0].symbol} / ${order.toToken[0].symbol}` : `${order.toToken[0].symbol} / ${order.fromToken[0].symbol}`}`}
                                    
                                    </CardContentRowContainerSmallText>
                                
                                {index < trade.orders.length-1 && <TradeHR></TradeHR>}


                                
                                </>
                            )
                        })
                    }))}
                </CardContentColumnContainer>
            </CardContentContainer>
        </TradeCard>
        </>
    )
}