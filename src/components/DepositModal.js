
import React, {useState, useEffect} from 'react'
import styled from "styled-components"
import {useWeb3React} from "@web3-react/core";
import {ethers} from "ethers";
//addresses etc
import {ERC20Abi, MasterChefABI} from "../config/abis" //will need forapprove button
import { addresses } from "../config/addresses";
import { POOLS } from '../config/pools';
import TOKENLIST from "../config/TOKENLIST.json"

import {TokenButton} from "../pages/nftgallery/components/TokenSelector"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Container, Card, Modal} from "react-bootstrap"
import {FaTimesCircle, FaWallet} from "react-icons/fa"
import {FaGasPump} from "react-icons/fa"

import useFetchGasBalance from '../hooks/useFetchGasBalance';
import useFetchMaticBalance from "../hooks/useFetchMaticBalance"
import {writeContract, userStake, toFixed} from "../utils/nft";


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
    margin-bottom: 2.5rem;
    padding: 1rem 1.25rem 0.5rem;
    justify-content: space-between;
`


const TitleText = styled.h3`
    box-sizing: border-box;
    margin: 0px;
    min-width: 0px;
    font-weight: 600;
    font-size: 1.3em;
    color: #fbdb37 !important;
    align-self: center;

    @media (max-width: 439px) {
        display: none;
    }
`


const ExitButton = styled.button`
    outline: 0;
    border: 0;
    background-color: transparent !important;
    color: #fbdb37;
    cursor: pointer;
    font-size: 22px;
    font-weight: 600;
    height: 32px;
    margin-bottom: 12px;
    align-self: flex-end;
`
const FakeBackground = styled.div`
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    background: #transparent !important;
    position: fixed;
    display: flex;
    top: -1px;
    padding: 60px;

    @media (max-width: 768px) {
        background: linear-gradient(232deg, rgba(57,60,63,1) 17%, rgba(29,30,32,1) 82%) no-repeat !important; 
    }
`
const HeaderButtonSecondary = styled.button`
    border-radius: 15px;
    height: auto;
    width: auto;
    background: none;
    border-color: #fce984;
    border-width: 3px;
    color: #FFFFE0;
    font-size: 20px;
    font-weight: 600;
    margin-top: 20px;
    align-self: start;
    margin-right: 15px;
    border-style: solid;

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
`

const ModalContainer = styled(Container)`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: auto;
    width: 100%;
    justify-content: flex-start;
    align-content: center;
`
const ModalCard = styled(Card)`
    display: flex;
    flex-direction: column;
    padding: 0.3em;
    border-radius: 12px;
    position: relative;
    max-width: 480px;
    height: auto;
    width: 100%;
    backdrop-filter: blur(2px) saturate(189%);
    -webkit-backdrop-filter: blur(2px) saturate(189%);
    background-color: rgba(29, 30, 32, 0.99);
    border: 1px solid rgba(255, 255, 255, 0.225);
    box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;
    border-radius: 24px;
    margin-top: 1rem;
    align-self: center;
`
const ModalCardContentContainer = styled(Container)`
    display: flex;
    flex-direction: column;
    margin-top: 1em;
    justify-content: center;
    align-items: center;
    align-self: center;
`
const TokenLink = styled.a`
    text-decoration: none;
    cursor: pointer;

    &:hover {
      cursor: pointer;
      text-decoration: none;
    }
`
const MaticButton = styled(TokenButton)`
 
`
const TokenInput = styled.input`
  
    position: relative;
    display: flex;
    padding: 16px;
    margin-bottom: 1.8em;
    margin-top: 1.8em;
    -webkit-box-align: center;
    align-items: center;
    width: 100%;
    white-space: nowrap;
    background: none;
    outline: none;
    border-radius: 20px;
    background-color: rgb(33, 36, 41);
    color: rgb(255, 255, 255);
    border: 1px solid rgb(64, 68, 79);
    appearance: none;
    font-size: 18px;
    transition: border 100ms ease 0s;

`
const DepositButton = styled(HeaderButtonSecondary)`
    margin: 0px;
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
        border-color: rgba(251, 219, 55, 0.3);
        border-width: 3px;
        color: rgba(251, 219, 55, 0.3);
        font-size: 20px;
        font-weight: 800;
    }
`
const WalletIcon = styled(FaWallet)`
    @media (max-width: 400px) {
        font-size: 0.8em !important;
    }
`
const GasIcon = styled(FaGasPump)`
    @media (max-width: 400px) {
        font-size: 0.8em !important;
    }
`
const WalletText = styled.p`
    font-size: 1.1em;
    align-self: center;
    margin-top: auto;
    margin-bottom: auto;
    @media (max-width: 400px) {
        font-size: 0.8em !important;
    }
`
const MaxButton = styled(DepositButton)`
    @media (max-width: 400px) {
        font-size: 0.42em !important;
        margin-left: 1.3em !important;
        margin-right: none !important;

    }
`
const WalletButton = styled.button`
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
const WalletButtonContentContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
`

const DepositModal = (props) => {
    const {active, account, library, connector} = useWeb3React()
    // const [masterChefContract, setMasterChefContract] = useState(null)
    const [amount, setAmount] = useState('')
    const {data: balanceData} = useFetchGasBalance()
    const {data: maticBalanceData} = useFetchMaticBalance()

    //props
    // const bal = props.walletBalance;
    // console.log("pooooop")
    // console.log(bal)

    

    

    // useEffect( () => {
    //     if (active) {
    //       const masterChef = writeContract(
    //           active, 
    //           library.getSigner(), 
    //           account,
    //           addresses.masterChef,
    //           MasterChefABI,
    //           )
    //       .then( value => setMasterChefContract(value))
    //     } else {
    //       const noData = setMasterChefContract(null)
    //     }
        
        
    //   }, [account, library])

    

    

    //hide and show button
    let button;

    if (amount == '') {
        button = <DepositButton style={{width: "100%", alignSelf: "center"}} disabled>Gas Amount</DepositButton>;
      } else if (amount !== ''){
        button = <DepositButton style={{width: "100%", alignSelf: "center"}}  onClick={async () => props.handleStakeOnClick(props.pid, amount)}>Deposit Gas</DepositButton>;
      } else {
        button = <DepositButton style={{width: "100%", alignSelf: "center"}}  disabled >Deposit</DepositButton>;
      }
      
    const amountFilter = (e) => {
        e.preventDefault()
        const enteredAmount = e.target.value
        if (enteredAmount == '' || enteredAmount.match(/^[0-9]\d*\.?\d*$/)) {
            setAmount(enteredAmount)
            console.log("SLDKFJLSDKJF")
            console.log(balanceData)
        }   
    }
    
    return (

        <>
        { props.showDepositModal == true ? (
        <FakeBackground>
         
        <ModalContainer>
            <ModalCard>
                <ModalCardContentContainer>
                    <TitleContainer>
                    <TitleText>Deposit</TitleText>
                    <MaticButton
                            style={{alignSelf: "center"}}
                            side="in" data={"0"} symbol={"MATIC"} imageurl={"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0/logo.png"} setTokenOut={() => console.log('dud')} setTokenIn={() => console.log('dud')}>
                            <TokenLink href={"https://polygonscan.com/"} target="_blank">
                            </TokenLink>

                            </MaticButton>
                    <ExitButton onClick={() => props.setShowDepositModal()}><FaTimesCircle/></ExitButton>
                    </TitleContainer>

                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                        <div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "baseline", height: "100%", width: "100%"}}>
                            

                        <WalletButton style={{marginTop: "1.0em", padding: "1.42em"}}> 
                            <WalletButtonContentContainer>
                            <GasIcon style={{fontSize: "1.5em", marginRight: "0.4em"}}/>

                                <WalletText >
                                    {balanceData.loading !== true  ? toFixed(balanceData.gasBalance, 4) : 'loading...' }
                                </WalletText>

                            </WalletButtonContentContainer>
                            
                        </WalletButton>
                        </div>
                        

                        <WalletButton style={{marginTop: "1.0em", padding: "1.42em"}}> 
                            <WalletButtonContentContainer>
                            <WalletIcon style={{fontSize: "1.5em", marginRight: "0.4em"}}/>

                                <WalletText >
                                    {balanceData.loading !== true  ? toFixed(maticBalanceData, 4) : 'loading...' }
                                </WalletText>
                                <MaxButton
                                        style={{fontSize: "0.6em", fontWeight: "800", alignSelf: "center", padding: "0.4em", borderRadius: "0.9em", marginTop: "0px", marginLeft: "0.78em"}}
                                        onClick={() => setAmount(maticBalanceData)}>Max
                                </MaxButton>
                            </WalletButtonContentContainer>
                            
                        </WalletButton>

                        
                        
                    </div>
                    <TokenInput 
                        placeholder = "0.00"
                        value={amount}
                        onChange = {amountFilter}
                    />

                    {/* deposit button */}
                    <Container style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginBottom: "18px"}}>
                        {button}
                    </Container>

                </ModalCardContentContainer>
            
            </ModalCard>

        </ModalContainer>
        </FakeBackground>
        ) : (null)}
        </>
    )
}

export default DepositModal
