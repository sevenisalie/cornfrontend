import React from 'react'
import {Container, Card, Button} from "react-bootstrap";
import styled from "styled-components";

import {userMint} from "../../../utils/nft";


import {VaultNFTFooter} from "./VaultNFTFooter";
import {EthIcon, BitcoinIcon, DollarIcon} from "../../nftgallery/components/CreateVault"


export const MyNFTCard = styled(Card)`
    border-radius: 25px;
    height: 100%;
    width: 100%;
    backdrop-filter: blur(12px) saturate(149%);
    -webkit-backdrop-filter: blur(0px) saturate(149%);
    background-color: rgba(29, 30, 32, 0.57);
    border: 1px solid rgba(255, 255, 255, 0.125);
    box-shadow: 6px 6px 8px 0 rgba(0, 0, 0, 0.3);
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
    border: 5px solid #141516;
    background: #4c4e54;

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
export const NFTLineBreak = styled.hr`
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
    background: none;
    border-color: #fce984;
    border-width: 3px;
    color: #FFFFE0;
    font-size: 20px;
    font-weight: 600;
    margin-top: 20px;
    align-self: start;
    margin-right: 15px;

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

export const VaultNFTCard = (props, {vaultData}) => {
    console.log("NNGNNGNGNGNGNG")
    console.log(props.vaultData)

if (props.vaultData !== undefined) {
    return (
        <>
           <MyNFTCard>
                <MyNFTCardContainer>
                <NFTImageWrapper src={props.image}></NFTImageWrapper>
                <NFTBrandName>CornFinance Algo-Vault</NFTBrandName>
                <NFTTitle>{vaultData.vault}</NFTTitle>
                <NFTLineBreak size="8"/>
                <PriceRow>
                    <ButtonWrapper style={{justifyContent: "flex-start"}}><MintButton >Execute</MintButton></ButtonWrapper>
                    <ButtonWrapper style={{justifyContent: "flex-start"}}><MintButton >Flatten</MintButton></ButtonWrapper>
                    
                    <EthIcon />
                    <NFTTitle>Distributor</NFTTitle>

                </PriceRow>


                </MyNFTCardContainer>
            </MyNFTCard> 
        </>
    )
} else {
    return (
        <MyNFTCard></MyNFTCard>
    )
}

}

export default VaultNFTCard
