import styled from "styled-components"
import {ethers} from "ethers"
import React, {useEffect, useState, useReducer} from "react"
import { useWeb3React } from "@web3-react/core"
import { addresses } from "../../../config/addresses"
import { nftURI } from "../../../config/uri"
import {MasterChefABI, ERC20Abi} from "../../../config/abis"
import {NFTS} from "../../../config/nfts"
import {POOLS} from "../../../config/pools"

import axios from "axios"
import {stopLossAbi} from "../../../config/abis"
import {Container, Card, Button} from "react-bootstrap"
import {writeContract, userMint, toFixed} from "../../../utils/nft"
import {getUserTokenBalance} from "../../../utils/fetchUserData"

import {HiChevronDoubleUp, HiChevronDoubleDown} from "react-icons/hi"
import {BiDownArrow} from "react-icons/bi"
import {GiTwoCoins} from "react-icons/gi"
import {FaTimes} from "react-icons/fa"
import {FiDivide} from "react-icons/fi"
import {HeaderButtonSecondary} from "../../vaults/index"
import TokenSelector from "./TokenSelector"
import {EthIcon, BitcoinIcon, DollarIcon} from "../components/CreateVault"
import {useRefresh} from "../../../utils/useRefresh"


const MainContainer = styled.div`
    display: flex;
    height: auto;
    width: 100%;
    justify-content: space-around;

    @media (max-width: 315px) {
        flex-direction: column;
        grid-template-columns: auto;
        grid-template-rows: auto;
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
    return (
        <>
            <TitleContainer>
      
                <SubmitButton>{props.state.setSubmitButtonText}</SubmitButton>
            </TitleContainer>
        </>
    )
}


const orderReducer = (state, action) => {
    switch (action.type) {
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
       
   
    }
    return state
}

const initialState = {
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
    setTokenOut: '',
    setLimitPrice: '',
    setAmountIn: '',
    setAmountOut: '',
    setBalanceIn: '',
    setBalanceOut: '',
    marketPrice: '',
    setSubmitButtonText: 'Select a Token',
}


const LimitOrderEntry = (props, {openTradeWindowToggle}) => {
    
    const {active, account, library, connector} = useWeb3React()
    const { fastRefresh } = useRefresh()
    const [state, dispatch] = useReducer(orderReducer, initialState)

    const setBuySide = () => {
        dispatch({ type: 'buySide' })
    }

    const setSellSide = () => {
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
        console.log('Beans n Cocks')
    }

    const setAmountIn = (_amount) => {
        dispatch({ type: "setAmountIn", payload: _amount })
        console.log(state)
        setSubmitButtonText('Enter Price')

    }

    const setTokenOut = (_tokenData) => {
        dispatch({ type: "setTokenOut", payload: _tokenData })
        setSubmitButtonText('Enter Amount')
    }
    
    const setAmountOut = (_amount) => {
        dispatch({ type: "setAmountOut", payload: _amount })
        console.log(state)
    }

    const setMarketPrice = (_price) => {
        if (state.sell == true) {
            dispatch({ type: "marketPrice", payload: parseFloat(_price.BPerA) })
        } else if (state.buy == true) {
            dispatch({ type: "marketPrice", payload: parseFloat(_price.APerB) })
        }
    }

    const setBalanceIn = (_balanceIn) => {
        dispatch({ type: 'setBalanceIn', payload: _balanceIn})
    }

    const setBalanceOut = (_balanceOut) => {
        dispatch({ type: 'setBalanceOut', payload: _balanceOut})
    }


    const setLimitPrice = (_price) => {
        dispatch({ type: 'setLimitPrice', payload: _price })
        setSubmitButtonText('Submit')

    }

    const setSubmitButtonText = (_message) => {
        dispatch({ type: 'setSubmitButtonText', payload: _message})
    }

    //get price from router
    useEffect( async () => {
        if (state.setTokenOut !== '' && state.setTokenIn !== '') {
            try {
                const url = `https://cornoracleapi.herokuapp.com/router?tokenA=${state.setTokenIn.address}&tokenB=${state.setTokenOut.address}`
                const data = await axios.get(url)
                
                setMarketPrice(data.data)
            } catch (err) {console.log(err)}
        }
        console.log(state)
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


    //populate amount out when amount in and price exist
    useEffect(() => {

        if (state.sell == true) {
            if (state.setLimitPrice !== '') {
                const amountOutCalc = parseFloat(state.setAmountIn) * parseFloat(state.setLimitPrice)
                setAmountOut(amountOutCalc.toString())
            }
        }
        else if (state.buy == true) {
            if (state.setLimitPrice !== '') {
                const amountOutCalc = parseFloat(state.setAmountIn) / parseFloat(state.setLimitPrice)
                setAmountOut(amountOutCalc.toString())
            }
        }
        if (state.setAmountIn == '' && state.setLimitPrice !== '') {
            setAmountOut('')
        }
    }, [state.setAmountIn, state.setLimitPrice, state.side, state.setAmountOut])
 

    // const setMarketPrice = (_tokenA, _tokenB) => {
    //     dispatch({ type: "setMarketPrice", payload: })
    // }

    return (
        <>
        <MainContainer>
            <EntryContainer>
                <CardContentContainer>
                    <FormContainer>
                        <TitleContainer>
                                <TitleRow>
                                    <TitleTextContainer>
                                        <TitleText>
                                            {`Limit Order`}
                                        </TitleText>
                                    </TitleTextContainer>
                                    <TitleToggleContainer>
                                        <TitleButtonGrid>
                                            <SellButtonLink onClick={setSellSide} isSelected={state.sell} > Sell</SellButtonLink>
                                            <BuyButtonLink onClick={setBuySide} isSelected={state.buy}> Buy</BuyButtonLink>
                                        </TitleButtonGrid>
                                    </TitleToggleContainer>

                                </TitleRow>
                            </TitleContainer>

                        <AmountEntry
                         state={state}
                         setAmountIn={setAmountIn}
                         side={"in"}
                         openTokenSelectorToggle={openTokenSelectorInToggle}
                         />


                        { state.sell == true 
                        ?
                        <FaTimes style={{justifySelf: "center", fontSize: "1.5em", paddingBottom: "0px !important", marginBottom: "0px !important", marginTop: "-1em", zIndex: "4545"}} /> 
                        :
                        <FiDivide style={{justifySelf: "center", fontSize: "1.5em", paddingBottom: "0px !important", marginBottom: "0px !important", marginTop: "-1em", zIndex: "4545"}} />
                        }

                        <PriceEntry state={state} setLimitPrice={setLimitPrice} />

                        <AmountEntry
                         state={state}
                         setAmountOut={setAmountOut}
                         side={'out'}
                         openTokenSelectorToggle={openTokenSelectorOutToggle} />

                        <PriceDisplay />


                        <SubmitSection state={state}/>

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
            

        </MainContainer>
        </>
    )
}

export default LimitOrderEntry









const PriceEntry = (props) => {

    const priceFilter = (e) => {
        e.preventDefault()
        const enteredAmount = e.target.value
        if (enteredAmount == '' || enteredAmount.match(/^[1-9]\d*\.?\d*$/)) {
            props.setLimitPrice(enteredAmount)
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
                    
                        <PriceEntryInput value={props.state.setLimitPrice} onChange={priceFilter} spellcheck="false" maxlength="79" minlength="1" placeholder="0.0" inputmode="decimal" autocomplete="off" pattern="^[0-9]*[.,]?[0-9]*$"></PriceEntryInput>

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
 
    

    const amountFilter = (e) => {
        e.preventDefault()

        const enteredAmount = e.target.value

        if (props.side == 'in') {
            if (enteredAmount == '' || enteredAmount.match(/^[1-9]\d*\.?\d*$/)) {
                props.setAmountIn(enteredAmount)
            } 
        } else if (props.side == "out") {
            if (enteredAmount == '' || enteredAmount.match(/^[1-9]\d*\.?\d*$/)) {
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
                                            <GiTwoCoins style={{marginRight: "5px"}}></GiTwoCoins>
                                          
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
                                 placeholder="0.0" 
                                 inputmode="decimal" 
                                 autocomplete="off" 
                                 pattern="^[0-9]*[.,]?[0-9]*$">
                        
                                 </PriceEntryInput>

                                

                                
                            </InputRow>

                            <TokenDataRow>
                                <TokenDataContentContainer>
                                    <TokenPriceSymbolContainer>
                                        <TokenBalanceText>Balance: { balance == NaN ? 0 : toFixed(balance, 4)} {symbol}</TokenBalanceText>
                                        <TokenMax >(Max)</TokenMax>
                                    </TokenPriceSymbolContainer>
                                    
                                    
                                    {props.side == 'in' &&
                                    <TokenPriceContainer>Price: $<TokenValue>{props.state.marketPrice !== '' ? props.state.marketPrice : '-'}</TokenValue></TokenPriceContainer>

                                    }
                                    {props.side == 'out' &&
                                    <TokenPriceContainer>$<TokenValue>{`-`}</TokenValue></TokenPriceContainer>

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
`

const ClearFormContainer = styled.div`
    display: flex;
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

export const PriceDisplay = () => {
    return (
        <>
        <PriceContainer>
            <ClearFormContainer>
                <ClearFormButton>Clear</ClearFormButton>
            </ClearFormContainer>
            <RateContainer>
                <RateSwapButton>1 Matic = 1 Matic</RateSwapButton>
            </RateContainer>
        </PriceContainer>  
        </>
    )
}

