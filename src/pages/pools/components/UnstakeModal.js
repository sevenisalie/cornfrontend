
import React, {useState, useEffect} from 'react'
import styled from "styled-components"
import {useWeb3React} from "@web3-react/core";
import {ethers} from "ethers"

//addresses etc
import {ERC20Abi, MasterChefABI} from "../../../config/abis" //will need forapprove button
import { addresses } from "../../../config/addresses";
import {writeContract, userUnstake} from "../../../utils/nft";


import {Container, Card, Modal} from "react-bootstrap"
import {HeaderButtonSecondary} from "../../vaults/index"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    
    height: 100%;
    width: auto;
    padding: 0;
`
const ModalCard = styled(Card)`
    display: flex;
    flex-direction: column;
    padding: 0;
    border-radius: 12px;
    height: 60%;
    width: auto;
    background-color: #1D1E20;
    box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
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

const TokenInput = styled.input`
  
    width: 90%;
    height: 70px !important;
    border: none;
    background: #292C2D;
    color: white;
    border-radius: 20px;
    border-width: 1px !important;
    border-color: #4e5456 !important;
    padding: 7px;
    font-size: 22px;
    box-shadow: 0px 3px 15px rgba(0,0,0,0.2);

`

const WithdrawButton = styled(HeaderButtonSecondary)`
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

const UnstakeModal = (props, {showUnstakeModal, setShowUnstakeModal, userStaked, pid}) => {
    const {active, account, library, connector} = useWeb3React();
    const [masterChefContract, setMasterChefContract] = useState(null)
    const [amount, setAmount] = useState('')
    const [userStakedAmount, setUserStakedAmount] = useState(userStaked)
    const [poolId, setPoolId] = useState(pid)

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
                    const tx = await userUnstake(masterChefContract, pid, amount)
                    setShowUnstakeModal(prev => !prev)
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


 
    let button;
    if (amount == '') {
        button = <WithdrawButton disabled>Withdraw</WithdrawButton>;
      } else if (amount !== ''){
        button = <WithdrawButton onClick={async () => handleUnstakeOnClick(poolId, amount)}>Withdraw</WithdrawButton>
        ;
      } else {
        button = <WithdrawButton disabled >Withdraw</WithdrawButton>;
      }


    return (
        <>
        { showUnstakeModal ? (
            
        <FakeBackground>

        <ModalContainer showUnstakeModal={showUnstakeModal}>
            <ModalCard>
                <ModalCardContentContainer>
                    <ExitButton onClick={() => setShowUnstakeModal(prev => !prev)}><FaTimesCircle/></ExitButton>
                    <Container style={{display: "flex", flexDirection: "row", justifyContent: "space-around", marginBottom: "18px"}}>
                    <p style={{fontSize: "1.4em", alignSelf: "flex-start", marginLeft: "1.0em"}}>
                        <FaWallet style={{fontSize: "1.5em", marginRight: "0.4em"}}/>
                        {props.state.userPoolData[pid].USER.stakedAmount !== null ? props.state.userPoolData[pid].USER.stakedAmount : "0"}
                        {props.state.userPoolData[pid].USER.stakedAmount !== null ? props.state.userPoolData[pid].USER.stakedAmount : "0" }
                        </p>
                    </Container>
                    <TokenInput 
                        placeholder = "0.00"
                        value={amount}
                        onChange = {(e) => setAmount(e.target.value)}
                    />
                    <Container style={{display: "flex", flexDirection: "row", justifyContent: "space-around", marginBottom: "18px"}}>
                        {button}
                        <ToastContainer></ToastContainer>

                    <HeaderButtonSecondary>Max</HeaderButtonSecondary>
                    </Container>


                </ModalCardContentContainer>
                <ModalCardFooter>
                    Withdraw
                </ModalCardFooter>
            </ModalCard>

        </ModalContainer>
        </FakeBackground>
        ) : (null)}
        </>
    )
}

export default UnstakeModal
