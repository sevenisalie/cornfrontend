import React from 'react'
import {Container, Card, Button} from "react-bootstrap";
import styled from "styled-components";

import {userMint} from "../../../utils/nft";


import {VaultNFTFooter} from "./VaultNFTFooter";
import {EthIcon, BitcoinIcon, DollarIcon} from "../../vaults/components/CreateVault"


export const MyNFTCard = styled(Card)`
    border-radius: 8px;
    height: auto;
    width: auto;
    background-color: #1D1E20;
    box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
`
const MyNFTCardContainer = styled(Container)`
    display: flex;
    flex-direction: column;
    padding: 12px;
    align-items: flex-start;
    align-content: flex-start;
    justify-content: space-around;
    gap: 8px;

    @media (max-width: 768px) {
        flex-direction: column;
      }
`
const NFTImageWrapper = styled.img`
    border-radius: 5px;
`
const NFTBrandName = styled.p`
    font-size: 70%;
    color: #fbdb37;
`
const NFTTitle = styled.h3`
    font-size: 120%;
    font-weight: 600;
    color: #fbfbfb;
`
const NFTLineBreak = styled.hr`
      color: #393C3F;
      width: 100%;
`
const PriceRow = styled(Container)`
    display: flex;
    flex-direction: row;
    width: 100%;
    margin-left: 0px;
    align-content: space-between;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
`

const ButtonWrapper = styled.div`
      display: flex;
      flex-direction: row;
      width: 40%;
      height: auto;
  
`

const MintButton = styled(Button)`
    border-radius: 15px;
    height: auto;
    width: auto;
    background: #fbdb37;
    border-color: #fce984;
    border-width: 3px;
    color: #FFFFE0;
    font-size: 20px;
    font-weight: 600;
   


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

export const VaultNFTCard = (props) => {


    return (
        <>
           <MyNFTCard>
                <MyNFTCardContainer>
                <NFTImageWrapper src={props.image}></NFTImageWrapper>
                <NFTBrandName>CornFinance</NFTBrandName>
                <NFTTitle>{props.title}</NFTTitle>
                <NFTLineBreak size="8"/>
                <PriceRow>
                    <ButtonWrapper style={{justifyContent: "flex-start"}}><MintButton >Execute</MintButton></ButtonWrapper>
                    <ButtonWrapper style={{justifyContent: "flex-start"}}><MintButton >Flatten</MintButton></ButtonWrapper>
                    
                    <EthIcon />
                    <NFTTitle>Accumulator</NFTTitle>

                </PriceRow>


                </MyNFTCardContainer>
            </MyNFTCard> 
        </>
    )
}

export default VaultNFTCard
