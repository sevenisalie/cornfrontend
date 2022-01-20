
import React, {useState, useEffect} from 'react'
import styled from "styled-components"
import {useWeb3React} from "@web3-react/core";
import {ethers} from "ethers";
//addresses etc
import {ERC20Abi, MasterChefABI} from "../../../config/abis" //will need forapprove button
import { addresses } from "../../../config/addresses";
import {writeContract, userStake, toFixed} from "../../../utils/nft";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Container, Card, Modal} from "react-bootstrap"
import {HeaderButtonSecondary} from "../../vaults/index"

import {FaTimesCircle, FaWallet} from "react-icons/fa"

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
    margin-bottom: 1rem;
    padding: 1rem 1.25rem 0.5rem;
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
    align-self: center;
`
const CloseButtonContainer = styled.div`
    display: flex;
    padding: 3px;
    align-content: center;
    justify-content: center;
`
const CloseButton  = styled.button`
    text-align: center;
    text-decoration: none;
    display: flex;
    flex-wrap: nowrap;
    z-index: 1;
    will-change: transform;
    transition: transform 450ms ease 0s;
    background-color: transparent;
    outline: none;
    cursor: pointer;
    user-select: none;
    border: none;

    &:select {
        -webkit-animation: rotate-out-center 0.6s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
        animation: rotate-out-center 0.6s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
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
const DepositForm = styled.form`

`
const TokenInput = styled.input`
  
    position: relative;
    display: flex;
    padding: 16px;
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

const DepositModal = (props) => {
    const {active, account, library, connector} = useWeb3React()
    const [masterChefContract, setMasterChefContract] = useState(null)
    const [amount, setAmount] = useState('')
    const [poolId, setPoolId] = useState(props.pid)

    //props
    // const bal = props.walletBalance;
    // console.log("pooooop")
    // console.log(bal)

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

    const handleStakeOnClick = async (poolId, amount) => {
        try {
            if (active) {
                const tx = await userStake(masterChefContract, poolId, amount)
                props.setShowDepositModal(prev => !prev)
                    if (tx) {
                        if (tx.status == 1) {
                            goodToast(`Successfully Unstaked... Allow for UI to Update`)
    
                        } else {
                            badToast("Unstake Failed... Check Gas Settings and Try Again")
                        }
                    } else if (tx === undefined) {
                        badToast(`Withdrawal cancelled`)
                    }
            }  
        } catch (err) {console.log(err)}

    }

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

    //hide and show button
    let button;

    if (amount == '') {
        button = <DepositButton disabled>Deposit</DepositButton>;
      } else if (amount !== ''){
        button = <DepositButton onClick={async () => handleStakeOnClick(poolId, amount)}>Deposit</DepositButton>;
      } else {
        button = <DepositButton disabled >Deposit</DepositButton>;
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
                        <p style={{fontSize: "1.4em", alignSelf: "flex-start", marginLeft: "1.0em"}}>
                        <FaWallet style={{fontSize: "1.5em", marginRight: "0.4em"}}/>
                        {props.state.userPoolData[poolId].USER.stakedAmount}
                        </p>
                    <TokenInput 
                        placeholder = "0.00"
                        value={amount}
                        onChange = {(e) => setAmount(e.target.value)}
                    />
                    <Container style={{display: "flex", flexDirection: "row", justifyContent: "space-around", marginBottom: "18px"}}>
                    {button}
                    <ToastContainer></ToastContainer>

                    <DepositButton>Max</DepositButton>
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
