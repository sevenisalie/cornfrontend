import React, {useEffect, useState} from 'react'
import styled from "styled-components"
import {TruncateAddress} from "../utils/TruncateAddress"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {Button} from "react-bootstrap";

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
    background: transparent;
    border-color: #fce984;
    border-width: 3px;
    color: #FFFFE0;
    font-size: 1.3em;
    font-weight: 800;
    align-self: center;
    position: relative;
    right: 0.2em;
    @media (max-width: 768px) {
        font-size: 0.7em;
        
       }
     
     @media (max-width: 375px) {
         font-size: 0.7em;
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

    const goodToast = (msg) => {
        const ToastStyle = {
            borderRadius: "50px",
            backdropFilter: "blur(12px) saturate(149%)",
            backgroundColor: "rgba(29, 30, 32, 0.57)",
            border: "2px solid rgba(251, 219, 55, 0.95)",
            padding: "0.42em",
            
        }

        const id = toast(`${msg}`, {
            position: toast.POSITION.BOTTOM_RIGHT,
            style: ToastStyle
        })
        toast.update(id, { render: `${msg}`, hideProgressBar: true, closeOnClick: true, position: "bottom-right", autoClose: 5000, className: 'rotateY animated', draggable: true})
    }

    const badToast = (msg) => {
        const ToastStyle = {
            borderRadius: "50px",
            backdropFilter: "blur(12px) saturate(149%)",
            backgroundColor: "rgba(29, 30, 32, 0.57)",
            border: "2px solid rgba(251, 219, 55, 0.95)",
            padding: "0.42em",
        }

        const id = toast(`${msg}`, {
            style: ToastStyle,
            position: toast.POSITION.BOTTOM_RIGHT,
        })
        toast.update(id, { render: `${msg}`, closeOnClick: true, hideProgressBar: true, position: "bottom-right", autoClose: 5000, className: 'rotateY animated', draggable: true })
    }

    useEffect( async () => {
        
        await handleConnect(injected);
        
    }, [])

    const handleConnect = async (connector) => {
        try {
            await activate(connector);
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            goodToast(`Connected to ${account}`)

        } catch (err) {console.log(err)}

    }

    const handleDisconnect = async () => {
        const leavingAccount = account

        try {
            deactivate(injected);
            badToast(`Disconnected from ${leavingAccount}`)
        } catch (err) {console.log(err)}
    }



    return (
        <>
        

        { !active ? 
        <>
        <TheButton onClick={() => handleConnect(injected)} >Connect</TheButton>
        </>
        :
        <>
        <TheButton library={library} onClick={() => handleDisconnect()} >{shortie}</TheButton>
        </>
        }
        </>
    )
}

export default ConnectButton
