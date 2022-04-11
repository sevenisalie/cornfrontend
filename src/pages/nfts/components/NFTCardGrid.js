import React, {useEffect, useState, useReducer} from 'react'
import styled from "styled-components"

import NFTCard from "./NFTCard"

import NFTS from "../../../config/nfts"

const NFTCardGridContainer = styled.div`
    display: grid; 
    grid-template-columns: auto auto; 
    grid-template-rows: 1fr; 
    gap: 0px 0px; 
    place-items: center;
    margin-top: 2em;
    @media (max-width: 712px) {
        display: grid; 
        grid-auto-columns: 1fr; 
        grid-template-columns: 1fr; 
        grid-template-rows: auto
        gap: 0px 0px; 
    }
`


const NFTCardGrid = (props) => {
    const NFTCollection = NFTS.map( (nft, index) => (
        <NFTCard contract={props.contracts} data={nft} id={index} mintFunction={props.mint}/>
    ))

    return (
        <>
            <NFTCardGridContainer>
               {NFTCollection}
            </NFTCardGridContainer>
        </>
    )
}

export default NFTCardGrid
