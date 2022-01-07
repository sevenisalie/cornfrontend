import React, {useState, useEffect} from 'react'
import styled from "styled-components";
import {stringToFixed} from "../../../utils/nft"
import {StyledDetailsButton, NFTLineBreak} from "../components/VaultNFTCard";
import {MultiplierBadge} from "../../pools/components/Badges"
import {HiChevronDoubleUp, HiChevronDoubleDown} from "react-icons/hi"
import {FaTicketAlt, FaCoins, FaFileInvoiceDollar} from "react-icons/fa"
import {MdSwapHorizontalCircle} from "react-icons/md"
import {Container, Card, Button} from "react-bootstrap";

const DetailsCard = styled(Card)`
    border-radius: 8px;
    height: 100%;
    width: auto;
    padding: 5px;
    background: linear-gradient(-45deg, rgba(0, 0, 0, 0.3), rgba(103, 107, 114, 0.1));
    background-color: transparent;

    box-shadow: 12px 12px 16px 0 rgba(0, 0, 0, 0.3), -10px -6px 12px 0 rgba(103, 107, 114, 0.1);
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
    margin-top: 8px;
    margin-bottom: 8px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    align-content: center;
    flex-wrap: wrap;
`

const DetailsGrid = styled(Container)`
    margin-top: 8px;
    margin-bottom: 8px;
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto;

    place-items: center;
    column-gap: 8px;
    row-gap: 3px;

`

const DetailsDropDownGrid = styled(Container)`
    margin: auto;
    
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto;
 
    place-items: center;
    column-gap: 4px;
    row-gap: 14px;
    

    @media (max-width: 768px) {
        flex-direction: column;
        grid-template-columns: auto;
        grid-template-rows: auto;
    }

`

export const VaultNFTFooter = ({nftData}) => {
    if (nftData !== undefined) {
        const amountA = stringToFixed(nftData.amounts[0].toString(), 5)
        const amountB = stringToFixed(nftData.amounts[1].toString(), 5)
        const amountC = stringToFixed(nftData.amounts[2].toString(), 5)

        return (
            <>
                 
    
                <DetailsDropDownGrid>
                    <DetailsRow>
                        <DetailsCard>
                        <FaTicketAlt style={{color: "#fbdb37", fontSize: "200%"}}></FaTicketAlt>

                        </DetailsCard>
                    </DetailsRow>
                
                    <DetailsGrid>
                        <NFTFooterBadge><p style={{fontSize: "1.4em", marginBottom: "1px", marginTop: "1px"}}>Amount In</p></NFTFooterBadge>
                        <NFTFooterBadge><p style={{fontSize: "1.4em", marginBottom: "1px", marginTop: "1px"}}>{amountA}</p></NFTFooterBadge>
                        <NFTFooterBadge><p style={{fontSize: "1.4em", marginBottom: "1px", marginTop: "1px"}}>Buy Price</p></NFTFooterBadge>
                        <NFTFooterBadge><p style={{fontSize: "1.4em", marginBottom: "1px", marginTop: "1px"}}>{amountB}</p></NFTFooterBadge>
                        <NFTFooterBadge><p style={{fontSize: "1.4em", marginBottom: "1px", marginTop: "1px"}}>Sell Price</p></NFTFooterBadge>
                        <NFTFooterBadge><p style={{fontSize: "1.4em", marginBottom: "1px", marginTop: "1px"}}>{amountC}</p></NFTFooterBadge>
                        
                    </DetailsGrid>
                 
                    <DetailsRow>
                        <DetailsCard>
                        <MdSwapHorizontalCircle style={{color: "#fbdb37", fontSize: "200%"}}></MdSwapHorizontalCircle>

                        </DetailsCard>
                        
                    </DetailsRow>
    
                    <DetailsGrid>
                        <NFTFooterBadge><p style={{fontSize: "1.4em", marginBottom: "1px", marginTop: "1px"}}>{nftData.tokens.tokenA.tokenName.toString()}</p></NFTFooterBadge>
                        <NFTFooterBadge><p style={{fontSize: "1.4em", marginBottom: "1px", marginTop: "1px"}}>{nftData.tokens.tokenB.tokenName.toString()}</p></NFTFooterBadge>
                        
                    </DetailsGrid>

                    <DetailsRow>
                        <DetailsCard>
                        <FaFileInvoiceDollar style={{color: "#fbdb37", fontSize: "200%"}}></FaFileInvoiceDollar>

                        </DetailsCard>
                        
                    </DetailsRow>

                    <DetailsGrid>
                        <NFTFooterBadge><p style={{fontSize: "1.4em", marginBottom: "1px", marginTop: "1px"}}>Performance</p></NFTFooterBadge>
                        <NFTFooterBadge><p style={{fontSize: "1.4em", marginBottom: "1px", marginTop: "1px"}}>0.5%</p></NFTFooterBadge>
                    
                    </DetailsGrid>
                </DetailsDropDownGrid>
              
    
            </>
        )
    } else {
        return (<p> no datas</p>)
        
    }

    
}

export default VaultNFTFooter
