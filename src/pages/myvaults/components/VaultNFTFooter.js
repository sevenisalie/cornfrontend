import React, {useEffect, useState} from "react";
import { useWeb3React } from "@web3-react/core";
import LIMITABI from "../../../config/contracts/LimitOrderVault.json"
import STOPABI from "../../../config/contracts/StopLossVault.json"
import ACCDISTABI from "../../../config/contracts/AccumulatorDistributorVault.json"
import { addresses } from "../../../config/addresses";

import styled from "styled-components";
import axios from "axios"
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
    backdrop-filter: blur(12px) saturate(149%);
    -webkit-backdrop-filter: blur(0px) saturate(149%);
    background-color: rgba(29, 30, 32, 0.57);
    border: 1px solid rgba(255, 255, 255, 0.125);
    box-shadow: 12px 12px 16px 0 rgba(0, 0, 0, 0.3);
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

export const VaultNFTFooter = (props) => {

    

    const VAULTSWITCH = [
        { 
            name: "limit",
            address: addresses.vaults.limitVault,
            abi: LIMITABI.abi
        },
        { 
            name: "stop",
            address: addresses.vaults.stopVault,
            abi: STOPABI.abi
        },
        { 
            name: "accumulatordistributor",
            address: addresses.vaults.accDistVault,
            abi: ACCDISTABI.abi
        },
    ]


    



    
    if (props.userTradeData !== null) {


        const mappedTradeData = props.userTradeData.map( (item) => {
            // const amountA = stringToFixed(item.rates.amountA.toString(), 5)
            // const amountB = stringToFixed(item.rates.amountB.toString(), 5)
            // const rateA = stringToFixed(data.rates.AB.toString(), 5)
            // const rateB = stringToFixed(data.rates.BA.toString(), 5)
            return (
                <>
                    <DetailsGrid>
                        <NFTFooterBadge><p style={{fontSize: "1.4em", marginBottom: "1px", marginTop: "1px"}}>Amount In</p></NFTFooterBadge>
                        <NFTFooterBadge><p style={{fontSize: "1.4em", marginBottom: "1px", marginTop: "1px"}}></p></NFTFooterBadge>
                        <NFTFooterBadge><p style={{fontSize: "1.4em", marginBottom: "1px", marginTop: "1px"}}>Amount Out</p></NFTFooterBadge>
                        <NFTFooterBadge><p style={{fontSize: "1.4em", marginBottom: "1px", marginTop: "1px"}}></p></NFTFooterBadge>
                        <NFTFooterBadge><p style={{fontSize: "1.4em", marginBottom: "1px", marginTop: "1px"}}>Sell Price A:B</p></NFTFooterBadge>
                        <NFTFooterBadge><p style={{fontSize: "1.4em", marginBottom: "1px", marginTop: "1px"}}></p></NFTFooterBadge>
                        <NFTFooterBadge><p style={{fontSize: "1.4em", marginBottom: "1px", marginTop: "1px"}}>Sell Price B:A</p></NFTFooterBadge>
                        <NFTFooterBadge><p style={{fontSize: "1.4em", marginBottom: "1px", marginTop: "1px"}}></p></NFTFooterBadge>

                        
                    </DetailsGrid>
                </>
            )
        })

        return (
            <>
                 
    
                <DetailsDropDownGrid>
                    <DetailsRow>
                        <DetailsCard>
                        <FaTicketAlt style={{color: "#fbdb37", fontSize: "200%"}}></FaTicketAlt>

                        </DetailsCard>
                    </DetailsRow>
                
                        {/* {mappedTradeData} */}
                 
                    <DetailsRow>
                        <DetailsCard>
                        <MdSwapHorizontalCircle style={{color: "#fbdb37", fontSize: "200%"}}></MdSwapHorizontalCircle>

                        </DetailsCard>
                        
                    </DetailsRow>
    
                    <DetailsGrid>
                        <NFTFooterBadge><p style={{fontSize: "1.4em", marginBottom: "1px", marginTop: "1px"}}>sym</p></NFTFooterBadge>
                        <NFTFooterBadge><p style={{fontSize: "1.4em", marginBottom: "1px", marginTop: "1px"}}>sym</p></NFTFooterBadge>
                        
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
