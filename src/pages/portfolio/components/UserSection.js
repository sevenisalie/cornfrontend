import React from 'react'
import styled from "styled-components"

import useFetchPortfolio from "../../../hooks/useFetchPortfolio"
import { useWeb3React } from "@web3-react/core";

const SectionContainer = styled.div`
    display: flex;
    flex-direction: row;
    height: 482px;
    width: 100%;
    justify-content: space-around;
    align-items: center;
    align-content: center;
    padding: 2.5em;
    column-gap: 0.42em;
    @media (max-width: 666px) {
        flex-direction: column;
        row-gap: 0.8em;
    }
`

const CardOne = styled.div`
    border-radius: 50px;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 60%;
    backdrop-filter: blur(12px) saturate(149%);
    -webkit-backdrop-filter: blur(0px) saturate(149%);
    background-color: rgba(29, 30, 32, 0.57);
    border: 1px solid rgba(255, 255, 255, 0.125);
    box-shadow: var(--shadow-elevation-medium);
`
const CardTwo = styled.div`
    border-radius: 50px;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 30%;
    backdrop-filter: blur(12px) saturate(149%);
    -webkit-backdrop-filter: blur(0px) saturate(149%);
    background-color: rgba(29, 30, 32, 0.57);
    border: 1px solid rgba(255, 255, 255, 0.125);
    box-shadow: var(--shadow-elevation-medium);
`
const CardContentContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    justify-content: space-between;
`
const CardOneImage = styled.img`
    display: flex;
    height: 100%;
    width: 30%;
    border-radius: 0 50px 50px 0;
    opacity: 70%;
    align-self: flex-end;
`
const CardTwoImage = styled.img`
    display: flex;
    height: 100%;
    width: 100%;
    border-radius: 50px;
    opacity: 70%;

`
const UserSection = () => {
    const {account, library} = useWeb3React()
    const {data} = useFetchPortfolio(account)
    return (
        <>
           <SectionContainer>
               <CardOne>
                   <CardContentContainer>
                       <div style={{width: "70%", height: "100%", padding: "2em"}}>
                           <p>{JSON.stringify(data)}</p>
                       </div>
                       <CardOneImage src={"https://via.placeholder.com/150"}/>
                   </CardContentContainer>
               </CardOne>
               <CardTwo>
                   <CardContentContainer>
                       <CardTwoImage src={"https://via.placeholder.com/150"}/>
                   </CardContentContainer>
               </CardTwo>
            </SectionContainer> 
        </>
    )
}

export default UserSection
