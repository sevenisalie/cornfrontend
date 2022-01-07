import React, {useState, useEffect} from 'react'
import styled from "styled-components"
import {useWeb3React} from "@web3-react/core";
import {ethers} from "ethers";
//addresses etc
import {ERC20Abi, MasterChefABI} from "../../../config/abis" //will need forapprove button
import { addresses } from "../../../config/addresses";
import {writeContract, userStake} from "../../../utils/nft";

import {Container, Card, Modal} from "react-bootstrap"

//components
import CreateVault from "./CreateVault"
import {HeaderButtonSecondary} from "../../vaults/index"

import {FaTimesCircle, FaWallet} from "react-icons/fa"



const FakeBackground = styled.div`
    width: 100vw;
    height: 100vh;
    z-index: 9998;
    backdrop-filter: blur(12px);
    background: #transparent !important;
    position: fixed;
    display: inline;
    top: -1px;
    padding: 5px;
`

const ModalContainer = styled(Container)`
    display: grid;
    z-index: 9999;
    grid-template-columns: auto;
    grid-template-rows: auto;
    
    height: auto;
    width: auto;
    padding: 0;
`



export const MintModal = ({strategy, showModal, setShow, contract}) => {
    const {active, account, library, connector} = useWeb3React()

    return (
        <>
        { showModal ? 
        (   
        <FakeBackground>
            <ModalContainer>
                <CreateVault strat={strategy} nftContract = {contract} exitButtonHandler={setShow}> 

                </CreateVault>

            </ModalContainer>
        </FakeBackground>
        )
        :
        (
            (null)
        )
    
    }

            
        </>
    )
}

export default MintModal
