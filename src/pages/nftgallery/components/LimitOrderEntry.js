import styled from "styled-components"
import {ContractFactory, ethers} from "ethers"
import React, {useEffect, useState, useReducer} from "react"
import { useWeb3React } from "@web3-react/core"
import { addresses } from "../../../config/addresses"
import ADDRESSES from "../../../config/build/deployments/map.json"
import CONTROLLERCONTRACT from "../../../config/build/contracts/Controller.json"

import { nftURI } from "../../../config/uri"
import {MasterChefABI, ERC20Abi} from "../../../config/abis"
import {NFTS} from "../../../config/nfts"
import {POOLS} from "../../../config/pools"

import axios from "axios"
import {stopLossAbi} from "../../../config/abis"
import {Container, Card, Button} from "react-bootstrap"
import {writeContract, userMint, toFixed, createLimitTrade} from "../../../utils/nft"
import {getUserTokenBalance} from "../../../utils/fetchUserData"

import { oracleQuery } from "../../../queries/portfolioQueries"
import useGraphQuery from "../../../hooks/useGraphQuery"



import {HiChevronDoubleUp, HiChevronDoubleDown} from "react-icons/hi"
import {BiDownArrow} from "react-icons/bi"
import {GiTwoCoins} from "react-icons/gi"
import {FaTimes} from "react-icons/fa"
import {FiDivide} from "react-icons/fi"
import {HeaderButtonSecondary} from "../../vaults/index"
import TokenSelector from "./TokenSelector"
import OrderSelector from "./OrderSelector"
import {EthIcon, BitcoinIcon, DollarIcon} from "../components/CreateVault"
import {useRefresh} from "../../../utils/useRefresh"
import useFetchRouterInfo from "../../../hooks/useFetchRouterInfo"
import useFetchContractWrite from "../../../hooks/useFetchContractWrite"

import { approveStrategyWithERC20, erc20Allowance } from "../../../utils/portfolio"
import { VAULTS } from "../../../config/vaults"
import { STRATEGIES } from "../../../config/strategies"


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

const EntryContainer = styled.div`
    position: relative;
    max-width: 480px;
    width: 100%;
    backdrop-filter: blur(12px) saturate(149%);
    -webkit-backdrop-filter: blur(0px) saturate(149%);
    background-color: rgba(29, 30, 32, 0.57);
    border: 1px solid rgba(255, 255, 255, 0.125);    box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;
    border-radius: 24px;
    margin-top: 1rem;
`

const CardContentContainer = styled.div`
    display: box
    position: relative;
    padding: 8px;
`
const FormContainer = styled.div`
    display: grid;
    grid-auto-rows: auto;
    row-gap: 0.25em;
`
const TitleContainer = styled.div`
    padding: 1rem 1.25rem 0.5rem;
    width: 100%;
    color: rgb(195, 197, 203);
`
const TitleRow = styled.div`
    box-sizing: border-box;
    margin: 0px;
    min-width: 0px;
    width: 100%;
    display: flex;
    padding: 0px;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
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

`
const TitleToggleContainer = styled.div`
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

const TitleButtonGrid = styled.div`
    box-sizing: border-box;
    margin: 0px;
    min-width: 0px;
    width: 100%;
    padding: 0px;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: start;
    justify-content: flex-start;
    justify-self: flex-end;
    background-color: rgb(33, 36, 41);
    border-radius: 16px;
    display: grid;
    grid-auto-flow: column;
    overflow: auto;
`
const SellButtonLink = styled.a`
    font-size: 1rem;
    width: fit-content;
    padding: 8px 12px;
    border-radius: 12px;
    font-weight: 600;
    color: rgb(255, 255, 255);
    background-color: ${({isSelected}) => isSelected == true ? `rgb(44, 47, 54)` : `transparent`};
    display: flex;
    flex-flow: row nowrap;
    outline: none;
    cursor: pointer;
    text-decoration: none;

    &:hover {
        background-color: rgb(44, 47, 54);
        color: rgb(255, 255, 255);
    }
    &:focus {
        background-color: rgb(33, 35, 40);
        color: rgb(255, 255, 255);
    }
`
const BuyButtonLink = styled.a`
    font-size: 1rem;
    width: fit-content;
    padding: 8px 12px;
    border-radius: 12px;
    font-weight: 600;
    color: rgb(255, 255, 255);
    background-color: ${({isSelected}) => isSelected == true ? `rgb(44, 47, 54)` : `transparent`};
    display: flex;
    flex-flow: row nowrap;
    outline: none;
    cursor: pointer;
    text-decoration: none;

    &:hover {
        background-color: rgb(44, 47, 54);
        color: rgb(255, 255, 255);
    }
    &:focus {
        background-color: rgb(33, 35, 40);
        color: rgb(255, 255, 255);
    }
`
const InputContainer = styled.div`
    display: flex;
    flex-flow: column nowrap;
    position: relative;
    border-radius: 20px;
    background-color: rgb(44, 47, 54);
    z-index: 1;
    width: initial;
`

const InputBox = styled.div`
    border-radius: 20px;
    border: 1px solid rgb(44, 47, 54);
    background-color: rgb(33, 36, 41);
    width: initial;
`

const InputBoxLong = styled.div`
    display: grid;
    border-radius: 20px;
    border: 1px solid rgb(80, 80, 80);
    background-color: rgb(50, 50, 50);
    width: initial;
    margin-top: 15px;
    margin-bottom: 15px;
    padding: 7px 0px 10px;
    grid-template-columns: auto auto;
`
const InputRow = styled.div`
    display: flex;
    flex-flow: row nowrap;
    -webkit-box-align: center;
    align-items: center;
    padding: 1rem 1rem 0.75rem;
`
const TokenSelect = styled.button`
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
    background-color: rgb(33, 36, 41);
    color: rgb(255, 255, 255);
    border-radius: 16px;
    box-shadow: rgb(0 0 0 / 8%) 0px 6px 10px;
    outline: none;
    cursor: pointer;
    user-select: none;
    border: none;
    height: 2.4rem;
    width: initial;
    padding: 0px 8px;
    -webkit-box-pack: justify;
    justify-content: space-between;
    margin-right: 12px;

    &:hover {
        background-color: rgb(44, 47, 54);
    }
    &:focus {
        background-color: rgb(33, 35, 40);
    }
`
const TokenSelectContainer = styled.div`
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
    width: 100%;
`
const TokenLogoContainer = styled.div`
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
const TokenLogo = styled.span`
    margin: 0px 0.25rem;
    font-size: 18px;
`

const TokenDataRow = styled.div`
    display: flex;
    flex-flow: row nowrap;
    -webkit-box-align: center;
    align-items: center;
    color: rgb(255, 255, 255);
    font-size: 0.75rem;
    line-height: 1rem;
    padding: 0px 1rem 1rem;
    -webkit-box-pack: end;
    justify-content: flex-end;
`
const TokenDataContentContainer = styled.div`
    box-sizing: border-box;
    margin: 0px;
    min-width: 0px;
    width: 100%;
    display: flex;
    padding: 0px;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
`
const CardContentRowContainerSmallText = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: auto;
    align-items: center;
    align-content: center;
    font-size: 0.8em;
    color: rgba(250, 250, 250, 0.9);
    // cursor: pointer;
    margin-bottom: 10px
    border-radius: 16px;
    margin-left: 30px;
    margin-top: 5px;
    font-style: italic;
    font-weight: bold;

`

const TokenPriceSymbolContainer = styled.div`
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
const TokenBalanceText = styled.div`
    box-sizing: border-box;
    margin: 0px;
    min-width: 0px;
    font-weight: 400;
    font-size: 14px;
    color: rgb(195, 197, 203);
`
const TokenMax = styled.button`
    background-color: transparent;
    border: none;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    padding: 0px;
    color: #fbdb37;
    opacity: 1;
    pointer-events: initial;
    margin-left: 0.25rem;
`
const TokenPriceContainer = styled.div`
    box-sizing: border-box;
    margin: 0px;
    min-width: 0px;
    font-weight: 400;
    font-size: 14px;
    color: rgb(86, 90, 105);
`
const TokenValue = styled.span`
    cursor: auto;
    color: rgb(255, 255, 255);
    font-size: inherit;
    margin-left: 2px;
`


const svgArrow = styled.svg`
    margin: 0px 0.25rem 0px 0.35rem;
    height: 35%;

`

const TokenName = styled.div`
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
const TokenImage = styled.img`
    width: 24px;
    height: 24px;
    border-radius: 24px;
    box-shadow: rgb(0 0 0 / 8%) 0px 6px 10px;
    background-color: rgb(255, 255, 255);
`

const PriceEntryInput = styled.input`
    color: rgb(255, 255, 255);
    width: 0px;
    position: relative;
    font-weight: 500;
    outline: none;
    border: none;
    -webkit-writing-mode: horizontal-tb !important;
    flex: 1 1 auto;
    background-color: rgb(33, 36, 41);
    font-size: 24px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0px;
    appearance: textfield;
    text-align: right;
    text-rendering: auto;
    -webkit-rtl-ordering: logical;
    cursor: text;
`
const PriceCrossContainer = styled.div`
    padding: 4px;
    border-radius: 12px;
    height: 32px;
    width: 32px;
    position: relative;
    margin-top: -14px;
    margin-bottom: -14px;
    left: calc(50% - 16px);
    background-color: rgb(33, 36, 41);
    border: 4px solid rgb(33, 36, 41);
    z-index: 2;
`
const TokenPriceRow = styled.div`
    box-sizing: border-box;
    margin: 0px;
    min-width: 0px;
    width: 100%;
    display: flex;
    padding: 0px;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
`

const TokenPriceToggleContainer = styled.div`
    cursor: auto;
    color: rgb(255, 255, 255);
    font-size: inherit;
`
const SubmitButton = styled(HeaderButtonSecondary)`
    width: 100%;
    height: auto;
    margin-top: 0px;
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



const SubmitSection = (props) => {
    const {library} = useWeb3React()
    
    const allowPrice = (props.state.setLimitPrice > props.state.setAmountPrice)
    const allowOrderType = (props.state.orderType.pid !== '')
    console.log("PROPS", props, allowPrice, allowOrderType)
    return (
        <>
            <TitleContainer>
                {(allowPrice === true && allowOrderType === true) &&
                    <SubmitButton onClick={() => {
                        props.state.setTokenApproved ?
                            props.handleMintLimit(
                                props.state.orderType.pid,
                                props.state.setTokenIn.address,
                                props.state.setTokenIn.decimals,
                                props.state.setTokenOut.address,
                                props.state.setAmountIn,
                                props.state.setRealLimitPrice,
                                props.controller
                            ) :
                            approveStrategyWithERC20(
                                props.state.setTokenIn.address,
                                VAULTS.find(v => v.pid === props.state.orderType.pid).address,
                                ethers.constants.MaxUint256,
                                library.getSigner()
                            )
                    }}>{props.state.setSubmitButtonText}</SubmitButton>
                }
                {(allowOrderType === false) &&
                    <SubmitButton>{`Select Order Type`}</SubmitButton>
                }

                {(allowOrderType === true && allowPrice === false && props.state.orderType.pid === 2) &&
                    <SubmitButton>{`Price Lower Than Market Rate`}</SubmitButton>
                }

                {/* <SubmitButton >{props.state.setSubmitButtonText}</SubmitButton> */}

            </TitleContainer>
        </>
    )
}


const orderReducer = (state, action) => {
    switch (action.type) {
        case 'setTokenApproved': {
            return {
            ...state,
            setTokenApproved: action.payload
        }   
        }
        case 'setController': {
            return {
            ...state,
            setController: action.payload
        }   
        }
        case 'orderType': {
            return {
                ...state,
                orderType: action.payload,
                orderSelectorToggle: !state.orderSelectorToggle
            }
        }
        case 'orderSelectorToggle': {
            return {
                ...state,
                orderSelectorToggle: !state.orderSelectorToggle
            }
        }
        case 'sellSide': {
            return {
                ...state,
                sell: true,
                buy: false,
            }
        }
        case 'buySide': {
            return {
                ...state,
                sell: false,
                buy: true,
            }
        }
        
        case 'openTokenSelectorIn': {
            return {
                ...state,
                openTokenSelectorIn: !state.openTokenSelectorIn
            }
        }
        case 'openTokenSelectorOut': {
            return {
                ...state,
                openTokenSelectorOut: !state.openTokenSelectorOut
            }
        }
        case 'setTokenIn': {
            return {
                ...state,
                setTokenIn: action.payload,
                openTokenSelectorOut: false,
                openTokenSelectorIn: false,
            }
        }
        case 'setAmountIn': {
            return {
                ...state,
                setAmountIn: action.payload
            }
        }
        case 'setTokenOut': {
            return {
                ...state,
                setTokenOut: action.payload,
                openTokenSelectorOut: false,
                openTokenSelectorIn: false,
            }
        }
        case 'setAmountOut': {
            return {
                ...state,
                setAmountOut: action.payload
            }
        }
        case 'setPrice': {
            return {
                ...state,
                setPrice: action.payload
            }
        }
        case 'marketPrice': {
            return {
                ...state,
                marketPrice: action.payload 
            }
        }
        case 'setLimitPrice': {
            return {
                ...state,
                setLimitPrice: action.payload
            }
        }
        case 'setRealLimitPrice': {
            return {
                ...state,
                setRealLimitPrice: action.payload
            }
        }
        case 'setMaxGasPrice': {
            return {
                ...state,
                setMaxGasPrice: action.payload
            }
        }
        case 'setAmountPrice': {
            return {
                ...state,
                setAmountPrice: action.payload
            }
        }
        case 'setBalanceOut': {
            return {
                ...state,
                setBalanceOut: action.payload
            }
        }
        case 'setBalanceIn': {
            return {
                ...state,
                setBalanceIn: action.payload
            }
        }
        case 'setSubmitButtonText': {
            return {
                ...state,
                setSubmitButtonText: action.payload
            }
        }
        case 'bothMarketPrices': {
            return {
                ...state,
                bothMarketPrices: action.payload
            }
        }
       
   
    }
    return state
}

const initialState = {
    setController: "",
    orderType: {
        name: "",
        pid: ""
    },
    orderSelectorToggle: false,
    sell: true,
    buy: false,
    openTokenSelectorIn: false,
    openTokenSelectorOut: false,
    setTokenIn: {
        "name": "Ether",
        "address": "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
        "symbol": "ETH",
        "decimals": 18,
        "chainId": 137,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png"
        },
    setTokenOut: {
        "name": "USD Coin",
        "address": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        "symbol": "USDC",
        "decimals": 6,
        "chainId": 137,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
    },
    setLimitPrice: '',
    setRealLimitPrice: '',
    setAmountPrice: '',
    setAmountIn: '1',
    setAmountOut: '',
    setMaxGasPrice: '',
    setBalanceIn: '',
    setBalanceOut: '',
    marketPrice: '',
    bothMarketPrices: '',
    setSubmitButtonText: 'Submit',
    setTokenApproved: false
}


const LimitOrderEntry = (props, {openTradeWindowToggle}) => {
    const [override, setOverride] = useState(false)
    const {active, account, library, connector} = useWeb3React()
    const { fastRefresh } = useRefresh()
    const [state, dispatch] = useReducer(orderReducer, initialState)
    const {data:routerInfo, approval, triggerRefresh} = useFetchRouterInfo(state.setTokenIn, state.setTokenOut, state.setAmountIn )
    const [limitPriceCount, setLimitPriceCount ] = useState(Array.from(Array(1).keys())    )
    const [limitPrices, setLimitPrices] = useState(Array(limitPriceCount))
    const [tokenAllowance, setTokenAllowance] = useState(0)
    

    const [contract] = useFetchContractWrite(addresses.vaults.controller, CONTROLLERCONTRACT.abi) 
    console.log("dale", contract)
    // const incrementInput = (_currentCount, _setState) => {
    //     const newCount = _currentCount + 1
    //     const newArray = Array.from(Array(newCount).keys())
    //     _setState(newArray)
    //     console.log(limitPriceCount.length)
    // }

    // const decrementInput = (_currentCount, _setState) => {
    //     const newCount = _currentCount - 1
    //     const newArray = Array.from(Array(newCount).keys())
    //     _setState(newArray)
    //     console.log(limitPriceCount.length)
    // }

    // const addLimitPrice = (_price, _id, _limits) => {
    //     const newLimits = _limits[_id].push(_price)
    //     setLimitPrices(newLimits)
    // }

    const clearOrderEntry = () => {
        dispatch({ type: 'setLimitPrice', payload: ''})
        dispatch({ type: 'setAmountOut', payload: ''})
        dispatch({ type: 'setAmountIn', payload: ''})
    }

    const setOrderType = (_orderType) => {
        dispatch({ type: "orderType", payload: _orderType})
    }

    const openOrderSelectorToggle = () => {
        dispatch({ type: 'orderSelectorToggle' })
        console.log("reached")
    }

    const setBuySide = () => {
        clearOrderEntry()
        dispatch({ type: 'buySide' })
    }

    const setSellSide = () => {
        clearOrderEntry()
        dispatch({ type: "sellSide" })
    }

    const openTokenSelectorInToggle = () => {
        dispatch({ type: 'openTokenSelectorIn' })
        console.log("reached")
    }

    const openTokenSelectorOutToggle = () => {
        dispatch({ type: 'openTokenSelectorOut' })
        console.log("reached")
    }

    const setTokenIn = (_tokenData) => {
        dispatch({ type: "setTokenIn", payload: _tokenData })
        console.log('Beanssss n Cocks', _tokenData)
    }

    const setAmountIn = (_amount) => {
        dispatch({ type: "setAmountIn", payload: _amount })
        console.log(state)
        // setSubmitButtonText('Enter Price')

    }

    const setTokenOut = (_tokenData) => {
        dispatch({ type: "setTokenOut", payload: _tokenData })
        // setSubmitButtonText('Enter Amount')
    }
    
    const setAmountOut = (_amount) => {
        dispatch({ type: "setAmountOut", payload: _amount })
        console.log(state)
    }


    const setBalanceIn = (_balanceIn) => {
        dispatch({ type: 'setBalanceIn', payload: _balanceIn})
    }

    const setBalanceOut = (_balanceOut) => {
        dispatch({ type: 'setBalanceOut', payload: _balanceOut})
    }


    const setLimitPrice = (_price) => {
        dispatch({ type: 'setLimitPrice', payload: _price })
        // setSubmitButtonText('Submit')

    }

    const setSubmitButtonText = (_message) => {
        dispatch({ type: 'setSubmitButtonText', payload: _message})
    }

    const setAmountPrice = (_price) => {
        dispatch({ type: 'setAmountPrice', payload: _price })
        // setSubmitButtonText('Submit')
    }

    const setRealLimitPrice = (_price) => {
        console.log(":LSDKJFIWEJOJFOISDLJDSNVLJNSDL:FJLSDKFJ")
        const price = parseFloat(_price)
        console.log(price)
        const realPrice = (1 / price).toString()
        console.log(realPrice)
        dispatch({ type: "setRealLimitPrice", payload: realPrice})
    }

    const setTokenApproved = (_approved) => {
        dispatch({type: 'setTokenApproved', payload: _approved})
        if(!_approved) {
            setSubmitButtonText("Approve")
        }
        else {
            setSubmitButtonText("Submit")
        }
    }

    //get price from router
    useEffect( async () => {
        console.log("Archetype STATE LOG")
        console.log(state)
        console.log(routerInfo)
    }, [fastRefresh, state.setTokenIn, state.setTokenOut, state.sell, state.buy])

    //get balances
    useEffect( async () => {
        if (active && account && library) {
            if (state.setTokenOut !== '' && state.setTokenIn == '') {
                const tokenOutBalance = await getUserTokenBalance(active, library.getSigner(), account, state.setTokenOut.address, ERC20Abi)
    
                setBalanceOut(tokenOutBalance.float)
            } else if (state.setTokenOut !== '' && state.setTokenIn !== '') {
                const tokenInBalance = await getUserTokenBalance(active, library.getSigner(), account, state.setTokenIn.address, ERC20Abi)
                const tokenOutBalance = await getUserTokenBalance(active, library.getSigner(), account, state.setTokenOut.address, ERC20Abi)
    
                setBalanceOut(tokenOutBalance.float)
                setBalanceIn(tokenInBalance.float)
            }
            else if (state.setTokenOut == '' && state.setTokenIn !== '') {
                const tokenInBalance = await getUserTokenBalance(active, library.getSigner(), account, state.setTokenIn.address, ERC20Abi)
                setBalanceIn(tokenInBalance.float)
            }
        }
        
    }, [state.setTokenIn, state.setTokenOut])

    // useEffect( async () => {
    //     if(state.orderType.pid !== "" && state.setTokenIn.address !== "" && library && state.setAmountIn !== "") {
    //         const signer = library.getSigner()
    //         const allowance = await erc20Allowance(state.setTokenIn.address, account, VAULTS.find(v => v.pid === state.orderType.pid).address, signer)
    //         console.log("orderAllow", allowance)
    //         setTokenAllowance(allowance)
    //         if(allowance.gte(ethers.utils.parseUnits(state.setAmountIn, state.setTokenIn.decimals))) {
    //             setTokenApproved(true)
    //         }
    //     }
    // }

    useEffect(  () => {
        if(state.orderType.pid !== "" && state.setTokenIn.address !== undefined && library && state.setAmountIn !== "") {

            const whichVault = (_pid) => {
                const thisOne = VAULTS.filter( (vault) => {
                    return vault.pid === _pid
                })
                return thisOne[0]
            }

            const checkAllowance = async () => {
                const vault = whichVault(state.orderType.pid)
                const signer = library.getSigner()
                const allowance = await erc20Allowance(state.setTokenIn.address, account, vault.address, signer)
                const cleanAllowance = ethers.utils.formatUnits(allowance, state.setTokenIn.decimals)
                setTokenAllowance(allowance)
                if(parseFloat(cleanAllowance) >= parseFloat(ethers.utils.parseUnits(state.setAmountIn, state.setTokenIn.decimals)) ) {
                    setTokenApproved(true)
                }
                else {
                    setTokenApproved(false)
                }
            }

            checkAllowance()

        }
        else {
            setTokenApproved(true)
        }
    }, [state.orderType, state.setTokenIn, state.setAmountIn])

    const isNaN = function(value) {
        const n = Number(value);
        return n !== n;
    };


    //populate amount out when amount in and price exist
    useEffect(() => {
        if (state.setLimitPrice !== '') {
            const amountOutCalc = parseFloat(state.setAmountIn) * parseFloat(state.setLimitPrice)


            if (isNaN(amountOutCalc)) {
                setAmountOut("")
            }
            if (isNaN(amountOutCalc) === false) {
                setAmountOut(toFixed(amountOutCalc, 5))
            }
        }
    }, [state.side, state.setAmountIn])



    //change price then change amount out
    useEffect(() => {
        const amountOutCalc = parseFloat(state.setAmountIn) * parseFloat(state.setLimitPrice)
        setAmountOut(amountOutCalc.toString())
        if (isNaN(amountOutCalc)) {
            setAmountOut("")
        }
        if (isNaN(amountOutCalc) === false) {
            setAmountOut(toFixed(amountOutCalc, 5))
        }
    }, [state.setLimitPrice])

    //top right value displayer
    // useEffect(() => {

    //     if (state.setAmountIn !== '' && state.setLimitPrice !== '') {
    //         const amountOutCalc = parseFloat(state.setAmountIn) * parseFloat(state.setLimitPrice)
    //         setAmountPrice(amountOutCalc.toString())
    //         setAmountOut(amountOutCalc.toString())
    //         dispatch({type: "setMaxGasPrice", payload: "1000000000000"})
    //     }

    // }, [state.setAmountIn, state.side, state.setTokenIn, state.setTokenOut])

    useEffect(() => {
        // clearOrderEntry()
        if (override === true) {
            setOverride(false)
        }

    }, [state.setTokenOut])

    //create trade pid, tokenIn, tokenInDecimals, tokenOut, amountIn, price, _controllerContract
    const handleMintLimit = async (strategyId ,tokenIn, tokenInDecimals, tokenOut, amountIn, realLimitPrice, controller) => {
        if (account && state.setRealLimitPrice !== "" && state.setAmountIn !== "")
        try {
            const mint = await createLimitTrade(
                strategyId,
                tokenIn,
                tokenInDecimals,
                tokenOut,
                amountIn,
                realLimitPrice,
                controller
            )
        } catch (err) {console.log("createTrade", err)}
    }
 

    // const mappedLimitInputs = limitPriceCount.map( (count, id) => {
    //     return (
    //         <>
    //             <PriceEntry routerInfo={routerInfo} key={id} state={state} addLimitPrice={addLimitPrice} limitPrices={limitPrices} setLimitPrice={setLimitPrice} setRealLimitPrice={setRealLimitPrice}/>
    //         </>
    //     )
    // })

    return (
        <>
        <MainContainer>
            <EntryContainer>
                <CardContentContainer>
                    <FormContainer>
                       

                        <AmountEntry
                         state={state}
                         routerInfo={routerInfo}
                         setAmountOut={setAmountOut}
                         setAmountIn={setAmountIn}
                         side={"in"}
                         openTokenSelectorToggle={openTokenSelectorInToggle}
                         />

            

                        <FaTimes style={{justifySelf: "center", fontSize: "1.5em", paddingBottom: "0px !important", marginBottom: "0px !important", marginTop: "-1em", zIndex: "4545"}} /> 


                        <PriceEntry routerInfo={routerInfo} state={state} setAmountPrice={setAmountPrice} setOverride={setOverride} override={override} setLimitPrice={setLimitPrice} setRealLimitPrice={setRealLimitPrice}/>

                        <AmountEntry
                         state={state}
                         routerInfo={routerInfo}
                         setAmountOut={setAmountOut}
                         side={'out'}
                         openTokenSelectorToggle={openTokenSelectorOutToggle} />
                        <PriceDisplay openOrderSelectorToggle={openOrderSelectorToggle} state={state} clearOrderEntry={clearOrderEntry} />
                        

                        {/* <SubmitSection state={state} mintFunction={handleMintLimit} /> */}
                        <SubmitSection approveStrategyWithERC20={approveStrategyWithERC20} controller={contract} handleMintLimit={handleMintLimit} state={state}  />
                        
                    </FormContainer>
                </CardContentContainer>
            </EntryContainer>
            
            {state.openTokenSelectorIn == true &&
                
                <TokenSelectorOverlay>
                    <TokenSelector side={'in'} setTokenIn={setTokenIn} setTokenOut={setTokenOut} state={state} openTokenSelectorToggle={openTokenSelectorInToggle}/>
                </TokenSelectorOverlay>
                
            
            }
             {state.openTokenSelectorOut == true &&
                
                <TokenSelectorOverlay>
                    <TokenSelector side={'out'} setTokenIn={setTokenIn} setTokenOut={setTokenOut} state={state} openTokenSelectorToggle={openTokenSelectorOutToggle}/>
                </TokenSelectorOverlay>
                
            
            }
            {state.orderSelectorToggle == true &&
                
                <TokenSelectorOverlay>
                    <OrderSelector setOrderType={setOrderType} state={state} openOrderSelectorToggle={openOrderSelectorToggle}/>
                </TokenSelectorOverlay>
                
            
            }
        </MainContainer>
        </>
    )
}

export default LimitOrderEntry







const PriceEntry = (props) => {
    const [amount, setAmount] = useState(null)

    useEffect(() => {
        if (props.routerInfo) {
            props.setAmountPrice(props.routerInfo.amountOut / props.routerInfo.amountIn)
            if (props.override === false) {
                setAmount(toFixed(props.routerInfo.amountOut / props.routerInfo.amountIn, 5))
                props.setLimitPrice(props.routerInfo.amountOut / props.routerInfo.amountIn)
            }
        }
    }, [props.routerInfo, props.override])


    const priceFilter = (e) => {
        props.setOverride(true)
        e.preventDefault()
        const enteredAmount = e.target.value
        if (enteredAmount == '' || enteredAmount.match(/^[0-9]\d*\.?\d*$/)) {
            props.setLimitPrice(enteredAmount)
            props.setRealLimitPrice(enteredAmount)
        }   
        }
    
    
    return (
        <>
            <InputContainer >
                <InputBox>
                    <InputRow>
                 
                        <TokenLogoContainer>
                           
                            <TokenName>{`Price`}</TokenName>
                        </TokenLogoContainer>
                    
                     
                        <PriceEntryInput value={ props.override === true ? props.state.setLimitPrice : amount  } onChange={priceFilter} spellcheck="false" maxlength="79" minlength="1" placeholder="0.0" inputmode="decimal" autocomplete="off" pattern="^[0-9]*[.,]?[0-9]*$"></PriceEntryInput>
                    


                    </InputRow>
                </InputBox>
            </InputContainer>
            
        </>
    )
}








const AmountEntry = (props) => {
    const [useMax, setUseMax] = useState(false)
    const [symbol, setSymbol] = useState('')
    const [balance, setBalance] = useState('')
    const [amount, setAmount] = useState(null)
    const {data:oracleData} = useGraphQuery(oracleQuery(), "oracle")
    const [priceData, setPriceData] = useState('')
    const { fastRefresh, slowRefresh } = useRefresh()
    const [fromValue, setFromValue] = useState(0)
    const [toValue, setToValue] = useState(0)

    useEffect(() => {
        if(oracleData !== undefined) {
            setPriceData(oracleData)
            console.log("oracleData", priceData)
        }
    }, [oracleData, fastRefresh])


    useEffect(() => {
        if (props.side == 'in') {
            if (props.state.setTokenIn !== '') {
                const _symbol = props.state.setTokenIn.symbol
                const _balance = props.state.setBalanceIn
                setSymbol(_symbol)
                setBalance(_balance)
            }
        } else if ( props.side == 'out') {
            if (props.state.setTokenOut !== '') {
                const _symbol = props.state.setTokenOut.symbol
                const _balance = props.state.setBalanceOut
                setSymbol(_symbol)
                setBalance(_balance)
            }
        }
    }, [props.state.setTokenIn, props.state.setTokenOut, props.state.setBalanceIn, props.state.setBalanceOut])
 

    useEffect(() => {
        if(props.state.setTokenIn !== '' && props.state.setAmountIn !== '' && priceData !== '') {
            console.log("10-4", props.state.setTokenIn, props.state.setAmountIn, priceData)
            const token = priceData.erc20S.find(t => t.id === props.state.setTokenIn.address.toLowerCase())
            console.log("tokenlog", token)
            if(token !== undefined) {
                const rate = token.priceUSD * props.state.setAmountIn
                setFromValue(rate)
            }
            else {
                setFromValue(0)
            }
        }  
    }, [props.state.setTokenIn, props.state.setAmountIn, priceData])


    useEffect(() => {
        if(props.state.setTokenOut !== '' && props.state.setAmountOut !== '' && priceData !== '') {
            console.log("10-4", props.state.setTokenOut, props.state.setAmountOut, priceData)
            const token = priceData.erc20S.find(t => t.id === props.state.setTokenOut.address.toLowerCase())
            console.log("tokenlog", token)
            if(token !== undefined) {
                const rate = token.priceUSD * props.state.setAmountOut
                setToValue(rate)
            }
            else {
                setToValue(0)
            }
        }  
    }, [props.state.setTokenOut, props.state.setAmountOut, priceData])
    

    const amountFilter = (e) => {
        e.preventDefault()

        const enteredAmount = e.target.value

        if (enteredAmount === NaN) {
            props.setAmountOut('')
        }

        if (props.side == 'in') {
            if (enteredAmount == '' || enteredAmount.match(/^[0-9]\d*\.?\d*$/)) {
                props.setAmountIn(enteredAmount)
            } 
        } else if (props.side == "out") {
            if (enteredAmount == '' || enteredAmount.match(/^[0-9]\d*\.?\d*$/)) {
                props.setAmountOut(enteredAmount)
            }
        }
        
    }

    

    return (
    <>

                    <InputContainer>
                        <InputBox>

                            <InputRow>
                                <TokenSelect side={props.side} onClick={props.openTokenSelectorToggle}>
                                    <TokenSelectContainer>
                                        <TokenLogoContainer>

                            
                                            <img
                                            src={props.side == "in" ? props.state.setTokenIn.logoURI : props.state.setTokenOut.logoURI}
                                            style={{height: "auto", marginRight: "5px", width: "1.4em"}}
                                            >
                                            </img>
                             



                                            { props.state.setTokenOut === "" && props.side === "out" &&
                                                <TokenName style={{marginLeft: "0.1em"}}>Select</TokenName>
                                            }

                                            { props.state.setTokenIn === "" && props.side === "in" &&
                                                <TokenName style={{marginLeft: "0.1em"}}>Select</TokenName>
                                            }
                                          
                                                <TokenName>{`${symbol}`}</TokenName>
                                             
                                        </TokenLogoContainer>
                                        <BiDownArrow style={{marginLeft: "5px", fontSize: "0.69em"}} />
                                    </TokenSelectContainer>
                                </TokenSelect>

                            
                               


                              
                                    
                    
                                    
                                    <PriceEntryInput
                                    value={ props.side == 'in' ?  props.state.setAmountIn : props.state.setAmountOut} 
                                    onChange={amountFilter} 
                                    spellcheck="false" 
                                    maxlength="79" 
                                    minlength="1" 
                                    placeholder={amount ? amount : "0.0"}
                                    inputmode="decimal" 
                                    autocomplete="off" 
                                    pattern="^[0-9]*[.,]?[0-9]*$">
                           
                                    </PriceEntryInput>
                                 

                                

                                
                            </InputRow>

                            <TokenDataRow>
                                <TokenDataContentContainer>
                                    <TokenPriceSymbolContainer>
                                        <TokenBalanceText style={{color: "#fbdb37", marginRight: "0.2em"}}>Balance:</TokenBalanceText>
                                        <TokenBalanceText >{ balance == NaN ? 0 : toFixed(balance, 4)} {symbol}</TokenBalanceText>
                                    </TokenPriceSymbolContainer>
                                    
                                    
                                    {props.side == 'in' &&
                                    <TokenPriceContainer>Value: $<TokenValue>{fromValue !== 0 ? toFixed(fromValue,2) : "-"}</TokenValue></TokenPriceContainer>

                                    }
                                    {props.side == 'out' &&
                                    <TokenPriceContainer>$<TokenValue>{toValue !== 0 ? toFixed(toValue,2) : "-"}</TokenValue></TokenPriceContainer>

                                    }
                                </TokenDataContentContainer>
                            </TokenDataRow>

                        </InputBox>
                    </InputContainer>    
        </>
    )
}


const PriceContainer = styled.div`
    display: flex;
    width: 100%;
    height: auto;
    margin-bottom: 0px;
    padding: 2px;
    justify-content: space-between;
    align-content: space-between;
`

const ClearFormContainer = styled.div`
    display: flex;
        align-content: space-between;

`
const ClearFormButton = styled.button`
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
const RateContainer = styled.div`
    display: flex;
    align-content: space-between;
`

const RateSwapButton = styled(ClearFormButton)`
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
const SwapText = styled.div`
    display: flex;
    width: 100%;
    height: auto;
    font-size: 0.8em;
    align-text: center;
`


const OrderSelectorButton = styled(ClearFormButton)`

`

export const PriceDisplay = (props) => {
    const [direction, setDirection] = useState(true)
    const {data:results} = useFetchRouterInfo(props.state.setTokenIn, props.state.setTokenOut, props.state.setAmountIn)
    const [amount, setAmount] = useState(`1`)
    const [depositFee, setDepositFee] = useState(0)
    const [txFee, setTxFee] = useState(0)

    useEffect(() => {
        if (results) {
            setAmount(toFixed(results.amountOut / results.amountIn, 3))
        }
    }, [results])

    useEffect(() => {
        if(props.state.setTokenIn !== '') {
            const strat = findStrategy(props.state.setTokenIn)
            setDepositFee(strat.depositFee)
            setTxFee(strat.txFee)
        }
    }, [props.state.setTokenIn])

    const findStrategy = (token) => {
        console.log("what", token)
        for(let i = 0; i < addresses.aaveTokens.length; i++) {
            if(addresses.aaveTokens[i].toLowerCase() === token.address.toLowerCase()) {
                return STRATEGIES[0]
            }
        }
        
        return STRATEGIES[1]
    }

    const switchAmounts = () => {
        if (direction === true) {
            if (amount !== '') {

                const floatyNum = inversePrice(results.amountOut / results.amountIn)
                setAmount(toFixed(floatyNum, 8))
            }
            if (amount == NaN) {
                setAmount("1")
            }
        }

        if (direction === false) {
            if (amount !== '') {
                setAmount(toFixed(results.amountOut / results.amountIn, 3))
            }

            if (amount === NaN) {
                setAmount("1")
            }
        }
        
    }
 
    const inversePrice = (_price) => {
        const inverse = 1 / parseFloat(_price)
        return inverse.toString()
    }

    const handleToggleDirection = () => {
        setDirection( prev => !prev)
        switchAmounts()

    }

    return (
        <>
        
        <PriceContainer>
            <ClearFormContainer>
                <ClearFormButton onClick={props.clearOrderEntry}>Clear</ClearFormButton>
            </ClearFormContainer>
            <ClearFormContainer>
            <OrderSelectorButton onClick={props.openOrderSelectorToggle}>
                {
                props.state.orderType.name !== ''
                ?
                props.state.orderType.name
                :
                `Order Type`
                }
                <BiDownArrow  style={{marginLeft: "0.2em"}}/>
            </OrderSelectorButton>
            </ClearFormContainer>

            <RateContainer style={{justifyContent: "flex-end"}}>
                { amount !== "1" && 
                    <RateSwapButton onClick={() => handleToggleDirection()}>
                
                        { direction == true 
                        ?
                        <SwapText>1 {props.state.setTokenIn.symbol} = {amount} {props.state.setTokenOut.symbol}</SwapText>
                        :
                        <SwapText>1 {props.state.setTokenOut.symbol} = {amount} {props.state.setTokenIn.symbol}</SwapText>
                        }

                    </RateSwapButton>
                }
                
            </RateContainer>
        </PriceContainer>  
        <InputBoxLong>
        <CardContentRowContainerSmallText>
            {`Deposit Fee: ${depositFee}%`}
        </CardContentRowContainerSmallText>
        <CardContentRowContainerSmallText>
            {`Transaction Fee: ${txFee}%`}
        </CardContentRowContainerSmallText>
        </InputBoxLong>
        </>
    )
}



