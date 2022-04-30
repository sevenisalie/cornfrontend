
import React, {useState, useEffect} from 'react'
import styled from "styled-components"
import {useWeb3React} from "@web3-react/core";
import {ethers} from "ethers"

//addresses etc
import {ERC20Abi, MasterChefABI} from "../../../config/abis" //will need forapprove button
import { addresses } from "../../../config/addresses";
import {writeContract, userUnstake, toFixed} from "../../../utils/nft";
import { POOLS } from '../../../config/pools';

import {Container, Card, Modal} from "react-bootstrap"
import {HeaderButtonSecondary} from "../../vaults/index"
import {TokenButton} from "../../nftgallery/components/TokenSelector"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {goodToast} from "../../../components/Toast"

import {FaTimesCircle, FaWallet} from "react-icons/fa"

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
const ModalCardFooter = styled.div`
    border-top: 1px solid #7a7f87;
    text-align: center;
    font-weight: 800;
    font-size: 200%;
    color: #a3a7ac;
    padding: 12px;
    height: 50%;
    width: 100%;
    background-color: #5e6268;
    align-self: stretch;
    border-radius: 0 0 12px 12px;

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

const WithdrawButton = styled(HeaderButtonSecondary)`
    margin: 0px;
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

const TitleText = styled.h3`
    box-sizing: border-box;
    margin: 0px;
    min-width: 0px;
    font-weight: 600;
    font-size: 1.3em;
    color: #fbdb37 !important;
    align-self: center;
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

const UnstakeModal = (props) => {
    const {active, account, library, connector} = useWeb3React();
    const [masterChefContract, setMasterChefContract] = useState(null)
    const [amount, setAmount] = useState('')

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

        const goodToast = (msg) => {
            toast.success(`${msg}`, {
                position: toast.POSITION.BOTTOM_RIGHT
            })
        }
    
        const badToast = (msg) => {
            toast.warning(`${msg}`, {
                position: toast.POSITION.BOTTOM_RIGHT
            })
        }

        const handleUnstakeOnClick = async (pid, amount) => {
            try {

                if (active) {
                    console.log(pid)
                    const tx = await userUnstake(masterChefContract, pid, amount, props.data.allData[props.pid].decimals)
                    props.setShowUnstakeModal(prev => !prev)
                    if (tx.status === 1) {
                        goodToast(`Deposit Successful. UI Syncing...`)
            
                        } 
                              
                        return tx


                }  
            } catch (err) {console.log(err)}

        }


 
    let button;
    if (amount === '') {
        button = <WithdrawButton style={{width: "100%", alignSelf: "center"}} disabled>Enter Amount</WithdrawButton>;
      } else if (amount !== ''){
        button = <WithdrawButton style={{width: "100%", alignSelf: "center"}} onClick={async () => await handleUnstakeOnClick(props.pid, amount)}>Withdraw</WithdrawButton>
        ;
      } else {
        button = <WithdrawButton style={{width: "100%", alignSelf: "center"}} disabled >Enter Amount</WithdrawButton>;
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
        { props.showUnstakeModal == true ? (
            
        <FakeBackground>

        <ModalContainer >
            <ModalCard>
                <ModalCardContentContainer>
                    <TitleContainer>
                        <TitleText>Withdraw</TitleText>
                        <ExitButton onClick={() => props.setShowUnstakeModal(prev => !prev)}><FaTimesCircle/></ExitButton>
                    </TitleContainer>

                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>

                        <TokenLink href={POOLS[props.pid].poolurl} target="_blank">
                            <TokenButton
                            style={{alignSelf: "center"}}
                            side="in" data={"0"} symbol={props.tokenUnstake} imageurl={props.imageurl} setTokenOut={() => console.log('dud')} setTokenIn={() => console.log('dud')}>
                            </TokenButton>
                        </TokenLink>

                        <div style={{alignSelf: "center", fontWeight: "800", fontSize: "0.7em", color: "rgba(242, 242, 242, 0.56", marginTop: "0.7em"}}>
                            BALANCE
                        </div>

                        <p style={{fontSize: "1.4em", marginTop: "1.0em"}}>
                        <FaWallet style={{fontSize: "1.5em", marginRight: "0.4em", color: "#fbdb37"}}/>

                        { props.data.userDataLoading === false ? toFixed(props.data.userData[props.pid].USER.stakedAmount, 6) : "0"}
                        <MaxButton
                            style={{fontSize: "0.6em", fontWeight: "800", padding: "0.4em", borderRadius: "0.9em", marginTop: "0px", marginLeft: "0.78em"}}
                            onClick={() => setAmount(props.data.userData[props.pid].USER.stakedAmount)}>Max
                        </MaxButton>
                        </p>
                    </div>

                    <TokenInput 
                        placeholder = "0.00"
                        value={amount}
                        onChange = {amountFilter}
                    />

                    {/* deposit button */}
                    <Container style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginBottom: "18px"}}>
                        {button}
                        <ToastContainer></ToastContainer>
                    </Container>
                


                </ModalCardContentContainer>
            </ModalCard>

        </ModalContainer>
        </FakeBackground>
        ) : (null)}
        </>
    )
}

export default UnstakeModal
