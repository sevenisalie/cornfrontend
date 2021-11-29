import React, {useState, useEffect} from 'react'
import styled from "styled-components";
import {StyledDetailsButton, NFTLineBreak} from "../../pools/components/PoolCard";
import {MultiplierBadge} from "../../pools/components/Badges"
import {HiChevronDoubleUp, HiChevronDoubleDown} from "react-icons/hi"
import {FaTicketAlt, FaCoins} from "react-icons/fa"
import {Container, Card, Button} from "react-bootstrap";

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

export const NFTFooter = () => {
    const [isOpen, setIsOpen] = useState(false)

    const handleDetailsOnClick = () => {
        setIsOpen( prev => !prev)
    }
    return (
        <>
             
        <DetailsButtonWrapper>
            <StyledDetailsButton style={{justifyContent: "flex-end"}} onClick={handleDetailsOnClick}>
                Details{isOpen ? <HiChevronDoubleUp/> : <HiChevronDoubleDown/>}
            </StyledDetailsButton>
        </DetailsButtonWrapper>

        { isOpen && 
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
                    <FaCoins style={{color: "#fbdb37", fontSize: "200%"}}></FaCoins>
                    <p style={{marginLeft: "3px"}}></p>
                </DetailsRow>

                <DetailsGrid>
                    <NFTFooterBadge><p style={{fontSize: "1.2em", marginBottom: "0px"}}>USDT</p></NFTFooterBadge>
                    <NFTFooterBadge><p style={{fontSize: "1.2em", marginBottom: "0px"}}>DAI</p></NFTFooterBadge>
                    <NFTFooterBadge><p style={{fontSize: "1.2em", marginBottom: "0px"}}>USDC</p></NFTFooterBadge>
                    <NFTFooterBadge><p style={{fontSize: "1.2em", marginBottom: "0px"}}>MiMATIC</p></NFTFooterBadge>
                </DetailsGrid>
            </DetailsDropDownGrid>
          
        }

        </>
    )
}

export default NFTFooter
