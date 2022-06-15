import React, {useEffect, useState} from 'react'
import styled from "styled-components"
import {useWeb3React} from "@web3-react/core"
import useFetchContractWrite from "../../../hooks/useFetchContractWrite"

import {CardContentContainer, FormContainer, ClearFormButton, EntryContainer} from "./LimitOrderEntry"
import {MdCancel} from "react-icons/md"
import {BsBoxArrowInRight} from "react-icons/bs"
import {GoSettings} from "react-icons/go"
const SlippageButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-left: 15px;
    width: 80%;
    height: 50px;
    padding: 2px;
    border-radius: 18px;
    justify-self: flex-start;
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
    font-size: 1em;



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

    ${({ isActive }) => isActive && `
    background: #393C3F;
    color: white;
  `}
`
const SlippageEntryInput = styled.input`
    color: rgba(255, 255, 255, 0.88);
    width: 100%;
    position: relative;
    font-weight: 500;
    outline: none;
    border: none;
    -webkit-writing-mode: horizontal-tb !important;
    flex: 1 1 auto;
    background-color: transparent;
    font-size: 1em;
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
//style={{marginLeft: "0.42em", height: "100%", width: "auto", alignSelf: "flex-end", justifySelf: "flex-end"}}
const SaveSlippageButton = styled(BsBoxArrowInRight)`
    font-size: 1.4em;
    font-weight: 600;
    margin-left: 0.42em;

`
const SaveButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: auto;
    margin-left: 1.42em;
    justify-content: flex-end;
    justify-self: center;
    align-self: center;
    cursor: pointer;
`
const SlippageSelector = (props) => {
    const buttonChoices = ["0.1", "0.5", "1"]
    const [activeButton, setActiveButton] = useState( () => props.state.slippage === "" ? "0.5" : props.state.slippage)
    
    const amountFilter = (e) => {
        e.preventDefault()
        
            if (e.target.value == '' || e.target.value.match(/^100(\.0{0,2}?)?$|^\d{0,2}(\.\d{0,2})?$/)) {
                props.setSlippage(e.target.value)
            } 
    }

    const slippageHandler = (e) => {
        setActiveButton(e.target.id)
        props.setSlippage(e.target.id)
    }


    return (
        <>
        <EntryContainer>
                <h3 style={{marginLeft: "35px", marginBottom: "0px", marginTop: "1em", alignSelf: "center", justifySelf: "center", fontSize: "1em"}}>Slippage</h3>
                <FormContainer style={{display: "flex", flexDirection: "row", alignSelf: "center", padding: "1em"}}>
                    <SlippageButtonContainer>

                    {buttonChoices.map(( button ) => (
                        <SlippageButton 
                        onClick={slippageHandler}
                        isActive={activeButton === button ? true : false} 
                        id={button} >
                            {button}{`%`}
                        </SlippageButton>

                    ))}


                        <SlippageEntryInput
                         value={props.state.slippage}
                         onChange={amountFilter} 
                         placeholder={`Custom`}
                         inputmode="decimal"  
                         pattern="^[0-9]*[.,]?[0-9]*$"

                         />
                    </SlippageButtonContainer>
                    

                    <SaveButtonContainer>
                        
                    <SaveSlippageButton onClick={props.toggleSlippage}  />
                    </SaveButtonContainer>

                </FormContainer>


        </EntryContainer>

        </>
    )
}

export default SlippageSelector
