import React, {useState, useEffect}from 'react'
import styled from "styled-components"
import { useWeb3React } from "@web3-react/core";

import {addresses} from "../../../config/addresses"
import {ERC20Abi} from "../../../config/abis"


import {createLimitTrade} from "../../../utils/nft"
import {getUserTokenBalance} from "../../../utils/fetchUserData"


import NavigationBar from "../../../components/NavigationBar"
import ExchangeRateCard from "../components/ExchangeRateCard"
import {HeaderButtonSecondary} from "../../vaults/index"
import {Card, Container, Button, Dropdown, Form} from "react-bootstrap"

//icon
import { BsGearFill } from "react-icons/bs";
import {FaEthereum, FaBitcoin} from "react-icons/fa"
import {FaTimesCircle, FaWallet} from "react-icons/fa"
import {BiDollarCircle} from "react-icons/bi"
import {BsFillArrowUpLeftSquareFill, BsFillArrowDownLeftSquareFill} from "react-icons/bs"
import {MdSwapVerticalCircle} from "react-icons/md"
const VaultSectionWrapper = styled(Container)`
    margin-top: 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

`

const VaultCard = styled(Card)`
    padding: 5px;
    border-radius: 12px;
    height: auto;
    width: 100%;
    background-color: #1D1E20;
    box-shadow: 0px 3px 15px rgba(0,0,0,0.2);


`
const CardHeadingContainer = styled(Container)`
    display: flex;
    flex-direction: row;
    padding-top: 5px;
    margin: 8px;
    margin-bottom: 25px;
    align-items: center;
    height: auto;
    width: auto;
    justify-content: space-between;
`
const CardHeading = styled.h2`
    font-size: 26px;
    font-weight: 600;
`


const SettingsButton = styled(Button)`
    
    background-color: transparent !important;
    border: none;

    &:hover {
        background-color: transparent !important;
        border: none;
    }

    &:focus {
        background-color: transparent !important;
        border: none;
    }

`

const CardBodyContainer = styled(Container)`
    display: flex;
    flex-direction: column;
    padding: 5px;
    width: 100%;
    height: auto;
    justify-content: center;
    align-items: center;
`

const TokenInput = styled.input`
  
    width: 96%;
    height: 60% !important;
    border: none;
    background: #292C2D;
    color: white;
    border-radius: 20px;
    border-width: 1px !important;
    border-color: #4e5456 !important;
    padding: 15px;
    font-size: 45px;
    box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
    text-align: start;
    direction: rtl;

`

const GearIcon = styled(BsGearFill)`
    &:hover {
        height: 22px;
        width: auto;
    }
`
export const EthIcon = styled(FaEthereum)`
`
export const BitcoinIcon = styled(FaBitcoin)`
`
export const DollarIcon = styled(BiDollarCircle)`
`

const CardFooterRow = styled(Container)`
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;
`

const DropDownSectionContainer = styled(Container)`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    justify-content: space-around;
`

const VaultForm = styled.form`
`

const DropDownButton = styled.select`
    border-radius: 15px;
    background: #292C2D;
    height: 42px;
    width: auto;
    font-weight: 600;
    font-size: 20px;
    border-color: #4e5456;
    color: #fbfbfb;
    margin-top: 10px;
    text-align-last:center; 
    -webkit-appearance: none;
    -moz-appearance: none;

    &:hover {
     
        background: #4e5456;
        border-color: #a6acae;
    }

    &:focus {
        background-color: !important #4e5456;
        border-color: !important #a6acae;
    }

    &:active {
        background-color: !important #4e5456;
        border-color: !important #a6acae;
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

`
const TokenGrid = styled(Container)`
    margin-top: 8px;
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto;
    justify-items: center;
    align-content: start;
    column-gap: 8px;
    row-gap: 9px;
    margin-bottom: 2px;

    @media (max-width: 768px) {
        flex-direction: column;
        grid-template-columns: auto;
        grid-template-rows: auto;
    }
`

const CardButtonRow = styled(Container)`
    display: flex;
    flex-direction: row;
    height: 100%;
    width: auto;
    align-items: center;
    justify-content: center;
`

const SubmitButton = styled(Button)`
    border-radius: 15px;
    height: 50px;
    width: 96%;
    background: #fbdb37;
    border-color: #fce984;
    border-width: 3px;
    color: #FFFFE0;
    font-size: 20px;
    font-weight: 600;
    margin-top: 15px;
    margin-bottom: 15px;


    &:hover {
        background: #fbdb37;
        border-color: #dfbb05;
        border-width: 3px;
        color: #dfbb05;
        font-size: 20px;
        font-weight: 800;
    }

    &:focus {
        background: #fbdb37;
        border-color: #dfbb05;
        border-width: 3px;
        color: #dfbb05;
        font-size: 20px;
        font-weight: 800;
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
const ExitButton = styled.button`
    outline: 0;
    border: 0;
    background-color: transparent !important;
    align-items: flex-start;
    color: #fbdb37;
    cursor: pointer;
    font-size: 22px;
    font-weight: 600;
    height: 32px;
    margin-bottom: 12px;
    align-self: flex-end;
`
const TokenImage = styled.img`
    width: auto;
    height: 50%;
    

    
`



export const CreateVault = ({exitButtonHandler, nftContract, strat}) => {
    const [amount, setAmount] = useState('')
    const [price, setPrice] = useState('')
    const [tokenIn, setTokenIn] = useState(addresses.tokens.MATIC)
    const [tokenInSymbol, setTokenInSymbol] = useState("COB")
    const [tokenInDecimals, setTokenInDecimals] = useState(18)
    const [tokenOut, setTokenOut] = useState(addresses.tokens.USDC)
    const [tokenOutDecimals, setTokenOutDecimals] = useState(18)
    const [tokenOutSymbol, setTokenOutSymbol] = useState("COB")

    const [strategy, setStrategy] = useState(strat)
    const {active, account, library, connector} = useWeb3React();

    const [balanceIn, setBalanceIn] = useState(0)
    const [balanceOut, setBalanceOut] = useState(0) 

    const [contract, setContract] = useState(nftContract)

    console.log(`
    Amount: ${amount}
    Token: ${tokenIn}
    TokenOUT: ${tokenOut}
    Price: ${price}
    Strategy: ${strategy}
    Contract: ${contract}
    Balance In: ${balanceIn}
    Balance Out: ${balanceOut}
`)

    useEffect( async () => {
        try {
            const balanceA = await getUserTokenBalance(
                active,
                library.getSigner(), 
                account, 
                tokenIn,
                ERC20Abi
                )
            const balanceB = await getUserTokenBalance(
                active,
                library.getSigner(), 
                account, 
                tokenOut,
                ERC20Abi
                )
            setBalanceIn(balanceA.float)
            setBalanceOut(balanceB.float)
            setTokenInDecimals(balanceA.decimals)
            setTokenOutDecimals(balanceB.decimals)
            setTokenInSymbol(balanceA.symbol)
            setTokenOutSymbol(balanceB.symbol)

        } catch (err) {console.log(err)}
 
    }, [tokenIn, tokenOut])


//  export const createStopLossTrade = async (to, tokenIn, tokenOut, amountIn, priceOut, _stopLossContract) => {

    // const handleMintVault = async () => {
    //     try {
    //         const mint = await createLimitTrade(
    //             account,
    //             tokenIn,
    //             tokenInDecimals,
    //             tokenOut,
    //             amount,
    //             price,
    //             contract
    //         )
    //     } catch (err) {console.log(err)}
    // }

    let button;
    if (amount == '' && tokenIn == '' && tokenOut == '') {
        button = <SubmitButton disabled size="lg">Enter Vault Info</SubmitButton>;
      } else if (amount !== '' && tokenIn !== '' && tokenOut !== ''){
        button = <SubmitButton size="lg">Create Vault</SubmitButton>;
      } else {
        button = <SubmitButton disabled size="lg">Enter Vault Info</SubmitButton>;
      }

    const amTokens =  addresses.amTokens
    const tokenChoices = amTokens.map( (token) => (
        
        <option value={token.address}>{token.symbol}</option>

        
    ))

    return (
        <>
            <VaultSectionWrapper>
            
                <VaultCard>
                <VaultForm>

                    <CardHeadingContainer>
                        <CardHeading>Create a Vault</CardHeading>
                        <ExitButton onClick={() => exitButtonHandler()}><FaTimesCircle/></ExitButton>
                    </CardHeadingContainer>


                    <CardBodyContainer>
                    <TokenInput
                      
                        placeholder = "Amount In"
                        value={amount}
                        onChange = {(e) => setAmount(e.target.value)}
                    >

                    </TokenInput>
                    </CardBodyContainer>

                    <CardBodyContainer>
                    <TokenInput
                        placeholder = "Stop Price"
                        value={price}
                        onChange = {(e) => setPrice(e.target.value)}
                    >

                    </TokenInput>
                    </CardBodyContainer>
                    <CardBodyContainer style={{flexDirection: "row"}}>
                        <ExchangeRateCard
                        tokenA={tokenIn}
                        tokenADecimals={tokenInDecimals}
                        tokenASymbol={tokenInSymbol}
                        tokenB={tokenOut}
                        tokenBDecimals={tokenOutDecimals}
                        tokenBSymbol={tokenOutSymbol}
                        >
                                
                        </ExchangeRateCard>
                    </CardBodyContainer>

                    <CardFooterRow>
                        <DropDownSectionContainer>
                                <DropDownButton
                                    value = {tokenIn}
                                    onChange = {(e) => setTokenIn(e.target.value)}
                                >

                                    <option value="" disabled selected>Token In</option>
                                   {tokenChoices}
                                    
                                </DropDownButton>

                                <MdSwapVerticalCircle style={{ color: "#fbdb37", fontSize: "1.6em", alignSelf: "center", marginTop: "5px"}}/>

                                <DropDownButton
                                    value = {tokenOut}
                                    onChange = {(e) => setTokenOut(e.target.value)}
                                >
                                    <option value="" disabled selected>Token Out</option>
                                    {tokenChoices}

                                </DropDownButton>

                        </DropDownSectionContainer>

                        <DropDownSectionContainer>
                            <InfoBox>
                                <h3 style={{alignSelf: "center"}}>Wallet Balance</h3>
                                <TokenGrid>
                                    <p style={{color: "#fbdb37", fontSize: "1.3em"}}>Token In: {tokenInSymbol}</p>
                                    <p style={{color: "#fbdb37", fontSize: "1.2em"}}>
                                        {balanceIn}
                                    </p>
                                    <p style={{color: "#fbdb37", fontSize: "1.3em"}}>Token Out: {tokenOutSymbol}</p>
                                    <p style={{color: "#fbdb37", fontSize: "1.2em"}}>
                                        {balanceOut}
                                    </p>
                                </TokenGrid>
                            </InfoBox>
                            
                        </DropDownSectionContainer>

                    </CardFooterRow>

                    <CardButtonRow>
                        {button}
                    </CardButtonRow>

                </VaultForm>
                </VaultCard>

            </VaultSectionWrapper>
        </>
    )
}

export default CreateVault