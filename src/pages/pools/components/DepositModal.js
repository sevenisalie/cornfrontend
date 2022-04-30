
import React, {useState, useEffect} from 'react'
import styled from "styled-components"
import {useWeb3React} from "@web3-react/core";
import {ethers} from "ethers";
//addresses etc
import {ERC20Abi, MasterChefABI} from "../../../config/abis" //will need forapprove button
import { addresses } from "../../../config/addresses";
import { POOLS } from '../../../config/pools';

import {writeContract, userStake, toFixed} from "../../../utils/nft";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {goodToast, badToast} from "../../../components/Toast"

import {Container, Card, Modal} from "react-bootstrap"
import {HeaderButtonSecondary} from "../../vaults/index"
import {TokenButton} from "../../nftgallery/components/TokenSelector"
import {FaTimesCircle, FaWallet} from "react-icons/fa"

import useFetchBalances from '../../../hooks/useFetchBalances';


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
    z-index: 9998;
    backdrop-filter: blur(12px);
    background: #transparent !important;
    position: fixed;
    display: flex;
    top: -1px;
    padding: 60px;
`

const ModalContainer = styled(Container)`
    display: grid;
    z-index: 9999;
    grid-template-columns: auto;
    grid-template-rows: auto;
    position: relative;
    height: auto;
    width: 100%;
    padding: 0;
    max-width: 480px;

`
const ModalCard = styled(Card)`
    display: flex;
    flex-direction: column;
    padding: 0;
    border-radius: 12px;
    position: relative;
    max-width: 480px;
    height: auto;
    width: 100%;
    backdrop-filter: blur(12px) saturate(189%);
    -webkit-backdrop-filter: blur(12px) saturate(189%);
    background-color: rgba(29, 30, 32, 0.88);
    border: 1px solid rgba(255, 255, 255, 0.225);
    box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;
    border-radius: 24px;
    margin-top: 1rem;
`
const ModalCardContentContainer = styled(Container)`
    display: flex;
    flex-direction: column;
    margin-top: 1em;
    justify-content: center;
    align-items: center;
`
const TokenLink = styled.a`
    text-decoration: none;
    cursor: pointer;

    &:hover {
      cursor: pointer;
      text-decoration: none;
    }
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
        border-color: #ffc67a;
        border-width: 3px;
        color: #ffc67a;
        font-size: 20px;
        font-weight: 800;
    }
`

const MaxButton = styled.div`
    display: inline;
    color: #fbdb37;
    font-size: 0.8em;
    align-self: center;
    &:hover {
        border-width: 3px;
        color: #dfbb05;
        cursor: pointer;
    }
`

const DepositModal = (props) => {
    const {active, account, library, connector} = useWeb3React()
    const [masterChefContract, setMasterChefContract] = useState(null)
    const [amount, setAmount] = useState('')
    const [verifiedDeposit, setVerifiedDeposit] = useState(false)
    const {data: balanceData} = useFetchBalances()


    const handleStakeOnClick = async (pid, amount) => {
        try {
            if (active) {
                goodToast(`Confirming Transaction`)
                const raw = await userStake(masterChefContract, pid, amount, props.data.allData[props.pid].decimals)
                const tx = await raw.wait()
                props.setShowDepositModal(prev => !prev)
              
                
                if (tx.status === 1) {
                goodToast(`Deposit Successful. UI Syncing...`)
                } 

                //error handled in userStake() :)
                      
                return tx
                     
            }  
          } catch (err) {
            console.log(err)
          }
  
      }


    const verifyDeposit = (_amount, _balance) => {
        const amountNum = parseFloat(_amount)
        const balanceNum = parseFloat(_balance)
        if (amountNum <= balanceNum ) {
            return true
        }
        if (amountNum > balanceNum ) {
            return false
        }
    }  
    

    

    useEffect( () => {
        if (active) {
          const masterChef = writeContract(
              active, 
              library.getSigner(), 
              account,
              addresses.masterChef,
              MasterChefABI,
              )
          .then( value => setMasterChefContract(value))
        } else {
          const noData = setMasterChefContract(null)
        }
        
        
      }, [account, library])

    

    

    //hide and show button
    let button;

    if (amount === '') {
        button = <DepositButton style={{width: "100%", alignSelf: "center"}} disabled>Enter Amount</DepositButton>;
      } else if (amount !== ''){
        button = <DepositButton style={{width: "100%", alignSelf: "center"}}  onClick={async () => await handleStakeOnClick(props.pid, amount)}>Deposit</DepositButton>;
      } else {
        button = <DepositButton style={{width: "100%", alignSelf: "center"}}  disabled >Enter Amount</DepositButton>;
      }
      
    const amountFilter = (e) => {
        e.preventDefault()
        const enteredAmount = e.target.value
        if (enteredAmount == '' || enteredAmount.match(/^[0-9]\d*\.?\d*$/)) {
            setAmount(enteredAmount)
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
                    <ExitButton onClick={() => props.setShowDepositModal(prev => !prev)}><FaTimesCircle/></ExitButton>
                    </TitleContainer>

                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>

                        <TokenLink href={POOLS[props.pid].poolurl} target="_blank">
                        <TokenButton
                        style={{alignSelf: "center", height: "auto", width: "auto"}}
                        side="in" data={"0"} symbol={props.tokenStake} imageurl={props.imageurl} setTokenOut={() => console.log('dud')} setTokenIn={() => console.log('dud')}>
                        </TokenButton>
                        </TokenLink>

                        <div style={{alignSelf: "center", fontWeight: "800", fontSize: "0.7em", color: "rgba(242, 242, 242, 0.56", marginTop: "0.7em"}}>
                            BALANCE
                        </div>

                        <div style={{display: "flex", flexDirection: "row"}}>
                            <p style={{fontSize: "1.4em", marginTop: "0.3em"}}>
                            <FaWallet style={{fontSize: "1.5em", marginRight: "0.4em"}}/>
                            {balanceData.loading !== true  ? toFixed(balanceData.balances[props.pid].string, 6) : 'loading...' }
                            <MaxButton
                                style={{fontSize: "0.6em", fontWeight: "800", padding: "0.4em", borderRadius: "0.9em", marginTop: "0px", marginLeft: "0.78em"}}
                                onClick={() => setAmount(balanceData.balances[props.pid].string)}>(Max)
                            </MaxButton>
                            </p>
                        </div>


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
