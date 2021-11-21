
import React, {useState, useEffect} from 'react'
import styled from "styled-components"
import {useWeb3React} from "@web3-react/core";
//addresses etc
import {ERC20Abi, MasterChefABI} from "../../../config/abis" //will need forapprove button
import { addresses } from "../../../config/addresses";
import {writeContract, userStake} from "../../../utils/nft";

import {Container, Card, Modal} from "react-bootstrap"
import {HeaderButtonSecondary} from "../../vaults/index"

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

const DepositModal = ({showDepositModal, setShowDepositModal}) => {
    const {active, account, library, connector} = useWeb3React()
    const [masterChefContract, setMasterChefContract] = useState(null)
    
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

    const handleStakeOnClick = async (pid, amount) => {
        try {
            if (active && amount > 0) {
                await userStake(masterChefContract, pid, amount)
            }  
        } catch (err) {console.log(err)}

    }

    return (

        <>
        { showDepositModal ? (
        <FakeBackground>
        <ModalContainer showDepositModal={showDepositModal}>
            <ModalCard>
                <ModalCardContentContainer>
                    <ExitButton onClick={() => setShowDepositModal(prev => !prev)}><FaTimesCircle/></ExitButton>
                    <Container style={{display: "flex", flexDirection: "row", justifyContent: "space-around", marginBottom: "18px"}}>
                        <FaWallet/>
                        {`Balance: 348539.35`}
                    </Container>
                    <TokenInput />
                    <Container style={{display: "flex", flexDirection: "row", justifyContent: "space-around", marginBottom: "18px"}}>
                    <HeaderButtonSecondary 
                    onClick={async () => handleStakeOnClick(0, '10')}
                    >
                        Deposit
                    </HeaderButtonSecondary>
                    <HeaderButtonSecondary>Max</HeaderButtonSecondary>
                    </Container>


                </ModalCardContentContainer>
                <ModalCardFooter>
                    Deposit
                </ModalCardFooter>
            </ModalCard>

        </ModalContainer>
        </FakeBackground>
        ) : (null)}
        </>
    )
}

export default DepositModal
