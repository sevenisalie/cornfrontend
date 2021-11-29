import React, {useEffect, useState} from 'react'
import styled from "styled-components"
import {Button} from "react-bootstrap";
import {TruncateAddress} from "../utils/TruncateAddress"

//web3 shit
import {InjectedConnector} from "@web3-react/injected-connector";
import { ethers, getSigner } from "ethers";
import {useWeb3React} from "@web3-react/core";

export const injected = new InjectedConnector({
    supportedChainIds: [1, 137],
})


const TheButton = styled(Button)`
 

    border-radius: 15px;
    height: auto;
    width: auto;
    background: #fbdb37;
    border-color: #fce984;
    border-width: 3px;
    color: #FFFFE0;
    font-size: 1.3em;
    font-weight: 800;

    @media (max-width: 768px) {
       font-size: 1em;
      }

    &:hover {
        background: #fbdb37;
        border-color: #dfbb05;
        border-width: 3px;
        color: #dfbb05;

        font-weight: 800;
    }

    &:focus {
        background: #fbdb37;
        border-color: #dfbb05;
        border-width: 3px;
        color: #dfbb05;
        font-weight: 800;
    }
    
`

export const ConnectButton = () => {
    const { active, account, library, connector, provider, activate, deactivate } = useWeb3React();
    const shortie = TruncateAddress(account);

    useEffect(() => {
        const eagerConnect = async (connector) => {
            try {
                activate(injected);
            } catch (err) {console.log(err)}
        }
        eagerConnect(injected);
        
    }, [])

    const handleConnect = async (connector) => {
        try {
            await activate(connector);
        } catch (err) {console.log(err)}
    }

    const handleDisconnect = async () => {
        try {
            deactivate(injected);
        } catch (err) {console.log(err)}
    }
    return (
        <>
        

        { !active ? 
        <TheButton onClick={() => handleConnect(injected)} >Connect</TheButton>
        :
        <TheButton library={library} onClick={() => handleDisconnect()} >{shortie}</TheButton>

        }
        </>
    )
}

export default ConnectButton
