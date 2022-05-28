import React from 'react'
import styled from "styled-components"

import useFetchPortfolio from "../../../hooks/useFetchPortfolio"
import { useWeb3React } from "@web3-react/core";

const SectionContainer = styled.div`
    display: flex;
    flex-direction: row;
    height: 382px;
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
    border-radius: 12px;
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 70%;
    margin-top: 2px;
    margin-bottom: 2px;
    background: url(/assets/images/portfoliobg.png) no-repeat center center fixed; 
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    box-shadow: var(--shadow-elevation-medium);
   
`
const CardTwo = styled.div`
    border-radius: 50px;
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 30%;
    margin-top: 2px;
    margin-bottom: 2px;
    background: url(https://via.placeholder.com/150) no-repeat center center fixed; 
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    box-shadow: var(--shadow-elevation-medium);
`
const CardContentContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    justify-content: space-between;
    backdrop-filter: saturate(149%);
    -webkit-backdrop-filter: blur(0px) saturate(149%);
    background-color: rgba(29, 30, 32, 1);
    border: 1px solid rgba(255, 255, 255, 0.125);
`
const CardOneImage = styled.img`
    width: auto;
    height: 380px;
    border-radius: 0 12px 12px 0;
    opacity: 100%;
    padding-top: 5em;
    align-self: flex-end;
`
const CardTwoImage = styled.img`
    
    height: auto;
    width: auto;
    border-radius: 50px;
    opacity: 70%;

`
const UserSection = () => {
    const {account, library} = useWeb3React()
    // const {data} = useFetchPortfolio(account)
    return (
        <>
           <SectionContainer>
               <CardOne>
                   <CardContentContainer style={{width: "90%"}}>
                       <div style={{display: "flex", flexDirection: "row", width: "auto", height: "100%", padding: "2em"}}>
                           {/* {JSON.stringify(data)} */}
                           {"Portfolio Data goes here"}
                       </div>
                   </CardContentContainer>
               </CardOne>
               <CardTwo>
               
               </CardTwo>
            </SectionContainer> 
        </>
    )
}

export default UserSection
