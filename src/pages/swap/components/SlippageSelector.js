import React, {useEffect, useState} from 'react'
import styled from "styled-components"
import {useWeb3React} from "@web3-react/core"
import useFetchContractWrite from "../../../hooks/useFetchContractWrite"

import {CardContentContainer, FormContainer, ClearFormButton, EntryContainer} from "./LimitOrderEntry"
import {MdCancel} from "react-icons/md"
import {GoSettings} from "react-icons/go"
const SlippageButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-left: 15px;
    width: 80%;
    height: 50px;
    padding: 2px;
    border-radius: 8px;
    align-self: center;
    justify-content: flex-start;
    align-items: center;
    backdrop-filter: blur(12px) saturate(149%);
    -webkit-backdrop-filter: blur(0px) saturate(149%);
    background-color: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.125);
    box-shadow:
    1.4px 4.2px 8.2px -50px rgba(0, 0, 0, 0.032),
    4.7px 14.1px 27.7px -50px rgba(0, 0, 0, 0.048),
    21px 63px 124px -50px rgba(0, 0, 0, 0.08);
    
    @media (max-width: 518px) {
        display: none;
      }
      @media (max-width: 700px) {
        margin-left: 5px;
        margin-right: 8px;
        width: auto;
      }

    
`
const SlippageButton = styled.button`
    height: auto;
    margin-left: 5px;
    margin-right: 5px;
    font-weight: 400;
    font-size: 1.3em;
    padding-left: 8px;
    padding-right: 8px;
    padding-top: 4px;
    padding-bottom: 4px;
    color: white;
    border-radius: 8px;
    border: 0px;
    text-decoration: none;
    background-color: transparent;

    @media (max-width: 1080px) {
        font-size: 0.9em;
        margin-left: 3px;
        margin-right: 3px;
      }

    @media (max-width: 768px) {
        font-size: 0.9em;
        margin-left: 3px;
        margin-right: 3px;
      }
    @media (max-width: 380px) {
        font-size: 0.6em;
        font-weight: 800;
        margin-left: 3px;
        margin-right: 3px;
      }

    &:hover {
        background: #393C3F;
        color: white;
        backdrop-filter: blur(12px) saturate(189%);
        -webkit-backdrop-filter: blur(0px) saturate(189%);
        background-color: rgba(255, 255, 255, 0.18);
    }

    &:active {
        padding-left: 8px;
        padding-right: 8px;
        padding-top: 4px;
        padding-bottom: 4px;
        background: #393C3F;
        color: white;
        backdrop-filter: blur(12px) saturate(149%);
        -webkit-backdrop-filter: blur(0px) saturate(149%);
        background-color: rgba(0, 0, 0, 0.3);
    }
`
const SlippageEntryInput = styled.input`
    color: rgb(255, 255, 255);
    width: 100%;
    position: relative;
    font-weight: 500;
    outline: none;
    border: none;
    -webkit-writing-mode: horizontal-tb !important;
    flex: 1 1 auto;
    background-color: transparent;
    font-size: 24px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0px;
    appearance: textfield;
    text-align: center;
    text-rendering: auto;
    -webkit-rtl-ordering: logical;
    cursor: text;

    &:select {
        border: 1px;
        border-color: rgba(0, 0, 0, 0.3);
    }
`

const SlippageSelector = (props) => {
    const buttonChoices = ["small", "medium", "large"]
    
    const amountFilter = (e) => {
        e.preventDefault()
        if (props.side == 'in') {
            if (e.target.value == '' || e.target.value.match(/^[0-9]\d*\.?\d*$/)) {
                props.setSlippage(e.target.value)
            } 
        } else if (props.side == "out") {
            if (e.target.value == '' || e.target.value.match(/^[0-9]\d*\.?\d*$/)) {
                props.setSlippage(e.target.value)
            }
        }
    }


    return (
        <>
        <EntryContainer>
            <CardContentContainer style={{display: "flex", flexDirection: "row !important"}}>
                <FormContainer style={{display: "flex", flexDirection: "row !important"}}>
                    <SlippageButtonContainer>
                        <SlippageButton id="small" >{`0.1%`}</SlippageButton>
                        <SlippageButton id="medium">{`0.5%`}</SlippageButton>
                        <SlippageButton id="large">{`1%`}</SlippageButton>
                        <SlippageEntryInput onChange={amountFilter} placeholder={`Custom`} />
                    </SlippageButtonContainer>
                    <ClearFormButton onClick={props.toggleSlippage} style={{marginLeft: "0.42em", height: "100%", width: "auto"}} >
                    <MdCancel />
                </ClearFormButton>
                </FormContainer>

            </CardContentContainer>

        </EntryContainer>

        </>
    )
}

export default SlippageSelector
