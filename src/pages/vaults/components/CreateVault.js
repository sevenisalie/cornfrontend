import React, {useState, useEffect}from 'react'
import styled from "styled-components"
import NavigationBar from "../../../components/NavigationBar"

import {Card, Container, Button, Dropdown, Form} from "react-bootstrap"

//icon
import { BsGearFill } from "react-icons/bs";
import {FaEthereum, FaBitcoin} from "react-icons/fa"
import {BiDollarCircle} from "react-icons/bi"

const VaultSectionWrapper = styled(Container)`
    margin-top: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

`

const VaultCard = styled(Card)`
    padding: 5px;
    border-radius: 12px;
    height: auto;
    width: auto;
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
    height: 100px !important;
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
    width: auto;
`

const DropDownSectionContainer = styled(Container)`
    display: flex;
    flex-direction: column;
    height: auto;
    width: 100%;
    justify-content: space-around;
`

const VaultForm = styled.form`
`

const DropDownButton = styled.select`
    border-radius: 15px;
    background: #292C2D;
    height: 88px;
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



export const Vault = () => {
    const [amount, setAmount] = useState('')
    const [token, setToken] = useState('')
    const [strategy, setStrategy] = useState('')
    console.log(`
        Amount: ${amount}
        Token: ${token}
        Strategy: ${strategy}
    `)
    let button;
    if (amount == '' && token == '' && strategy == '') {
        button = <SubmitButton disabled size="lg">Enter Vault Info</SubmitButton>;
      } else if (amount !== '' && token !== '' && strategy !== ''){
        button = <SubmitButton size="lg">Create Vault</SubmitButton>;
      } else {
        button = <SubmitButton disabled size="lg">Enter Vault Info</SubmitButton>;
      }
    return (
        <>
            <VaultSectionWrapper>
            
                <VaultCard>
                <VaultForm>

                    <CardHeadingContainer>
                        <CardHeading>Create a Vault</CardHeading>
                        <SettingsButton src={"#"}><GearIcon /></SettingsButton>
                    </CardHeadingContainer>


                    <CardBodyContainer>
                    <TokenInput
                        placeholder = "0.00"
                        value={amount}
                        onChange = {(e) => setAmount(e.target.value)}
                    >

                    </TokenInput>
                    </CardBodyContainer>

                    <CardFooterRow>
                        <DropDownSectionContainer>
                                <DropDownButton
                                    value = {token}
                                    onChange = {(e) => setToken(e.target.value)}
                                >
                                    <option value="" disabled selected>Token</option>
                                    <option value="USDC">USDC</option>
                                    <option value="ETH">ETH</option>
                                    <option value="BTC">BTC</option>
                                    <option value="MATIC">MATIC</option>
                                </DropDownButton>
                
                                <DropDownButton
                                    value = {strategy}
                                    onChange = {(e) => setStrategy(e.target.value)}
                                >
                                    <option value="" disabled selected>Strategy</option>
                                    <option value="SMACROSSOVER">SMA Crossover</option>
                                    <option value="MACD">MACD Standard</option>
                                    <option value="RSI">RSI Standard</option>
                                    <option value="SMALLBRACKET">3% Bracket</option>
                                    <option value="LARGEBRACKET">5% Bracket</option>

                                </DropDownButton>

                        </DropDownSectionContainer>

                        <DropDownSectionContainer>
                            <InfoBox>
                                <h3>Select a Strategy</h3>
                                <p>you must select a strategy on the right.  Then select the token you wish to trade and it's amount.</p>
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

export default Vault