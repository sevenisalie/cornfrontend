import { useWeb3React } from '@web3-react/core'
import React, {useState, useEffect} from 'react'
import { FaTimesCircle } from 'react-icons/fa'
import styled from "styled-components"
import {InjectedConnector} from "@web3-react/injected-connector";





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
    padding: 0.2rem 1.25rem 0.5rem;
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
    z-index: 9999;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    background: #transparent !important;
    position: fixed;
    display: flex;
    top: -1px;
    padding: 3em;

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

const ModalContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: auto;
    width: 100%;
    justify-content: flex-start;
    align-content: center;
`
const ModalCard = styled.div`
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
const ModalCardContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 1em;
    justify-content: center;
    align-items: center;
    align-self: center;
    padding: 0.9em;
`
const CardRow = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: auto;
    justify-content: center;
    align-content: center;
    align-items: center;
    column-gap: 0.42em;

    @media (max-width: 512px) {
        flex-direction: column;
    }
`
const WalletTypeCard = styled.button`
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    align-items: center;
    border-radius: 12px;
    padding: 0.3em;
    margin-top: 0.42em;
    margin-bottom: 0.42em;
    border: 1px solid rgba(242, 242, 242, 0.23);
    
    background: transparent;
    &:hover {
        cursor: pointer;
        background-color: rgba(242, 242, 242, 0.1);
    }
`
const WalletTypeLogo = styled.img`
    height: auto;
    width: 2em;
`
const WalletTypeLabel = styled.div`
    font-weight: 600;
    font-size: 1.5em;
    color: rgba(242, 242, 242, 0.96)
`
const WalletTypeText = styled.div`
    font-weight: 400;
    font-size: 1em;
    color: rgba(242, 242, 242, 0.59);
    text-align: center;
`
export const injected = new InjectedConnector({
    supportedChainIds: [1, 137],
})

const WalletCard = (props) => {
    return (
        <>
        { props.showDepositModal == true ? (
        <FakeBackground>
            <ModalContainer>
                <ModalCard>
                    <ModalCardContentContainer>
                    <TitleContainer>
                    <TitleText>Choose Wallet</TitleText>
                    <ExitButton onClick={() => props.setShowDepositModal()}><FaTimesCircle/></ExitButton>
                    </TitleContainer>

                    <CardRow>
                        <WalletTypeCard onClick={() => props.handleConnect(injected)}>
                            <WalletTypeLogo src={`https://raw.githubusercontent.com/MetaMask/brand-resources/c3c894bb8c460a2e9f47c07f6ef32e234190a7aa/SVG/metamask-fox.svg`}/>
                            <WalletTypeLabel>{`MetaMask`}</WalletTypeLabel>
                            <WalletTypeText>{`Connect to Your MetaMask Wallet`}</WalletTypeText>
                        </WalletTypeCard>

                        {/* <WalletTypeCard onClick={() => props.handleConnect(injected)}>
                            <WalletTypeLogo src={`https://avatars.githubusercontent.com/u/18060234?s=200&v=4`} />
                            <WalletTypeLabel>{`Coinbase Wallet`}</WalletTypeLabel>
                            <WalletTypeText>{`Connect to Your Coinbase Wallet`}</WalletTypeText>
                        </WalletTypeCard> */}
                    </CardRow>

                    </ModalCardContentContainer>
                </ModalCard>
            </ModalContainer>
        </FakeBackground>
        ) : (null)}
        </>
    )
}

export default WalletCard
