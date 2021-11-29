import React, {useState, useEffect} from 'react'
import styled from "styled-components";
import {StyledDetailsButton, NFTLineBreak} from "../../pools/components/PoolCard";
import {MultiplierBadge} from "../../pools/components/Badges"
import {HiChevronDoubleUp, HiChevronDoubleDown} from "react-icons/hi"
import {FaTicketAlt, FaCoins} from "react-icons/fa"
import {MdSwapHorizontalCircle} from "react-icons/md"
import {Container, Card, Button} from "react-bootstrap";

const DetailsCard = styled(Card)`
    border-radius: 8px;
    height: auto;
    width: auto;
    background-color: #1D1E20;
    box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
`

const NFTFooterBadge = styled(MultiplierBadge)`
    width: 100%;
    height: 100%;
    padding: 0px;
    padding-top: 1px;
    margin-bottom: 0px;
    margin-top: 1px;
`


const DetailsButtonWrapper = styled(Container)`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
    margin-top: 12px;
`

const DetailsRow = styled(Container)`
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
`

const DetailsGrid = styled(Container)`
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto;

    place-items: center;
    column-gap: 2px;
    row-gap: 3px;

`

const DetailsDropDownGrid = styled(Container)`
    margin-top: 12px;
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto;
 
    place-items: center;
    column-gap: 2px;
    row-gap: 12px;
    margin-bottom: 25px;

    @media (max-width: 768px) {
        flex-direction: column;
        grid-template-columns: auto;
        grid-template-rows: auto;
    }

`

export const VaultNFTFooter = () => {

    return (
        <>
             

        <DetailsCard>
            <DetailsDropDownGrid>
                <DetailsRow>
                    <FaTicketAlt style={{color: "#fbdb37", fontSize: "200%"}}></FaTicketAlt>
                </DetailsRow>
            
                <DetailsGrid>
                    <NFTFooterBadge><p style={{fontSize: "1.2em", marginBottom: "0px"}}>Performance Fee</p></NFTFooterBadge>
                    <NFTFooterBadge><p style={{fontSize: "1.2em", marginBottom: "0px"}}>COB Rewards</p></NFTFooterBadge>
                    <NFTFooterBadge><p style={{fontSize: "1.2em", marginBottom: "0px"}}>Accumulator</p></NFTFooterBadge>
                </DetailsGrid>

                <DetailsRow>
                    <MdSwapHorizontalCircle style={{color: "#fbdb37", fontSize: "200%"}}></MdSwapHorizontalCircle>
                    <p style={{marginLeft: "3px"}}></p>
                </DetailsRow>

                <DetailsGrid>
                    <NFTFooterBadge><p style={{fontSize: "1.2em", marginBottom: "0px"}}>USDT</p></NFTFooterBadge>
                    <NFTFooterBadge><p style={{fontSize: "1.2em", marginBottom: "0px"}}>ETH</p></NFTFooterBadge>
                    
                </DetailsGrid>
            </DetailsDropDownGrid>
          
        </DetailsCard>

        </>
    )
}

export default VaultNFTFooter
