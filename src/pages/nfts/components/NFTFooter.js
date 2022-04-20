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
    padding: 0.5em;
    margin-bottom: 0px;
    margin-top: 0px;
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

export const NFTFooter = (props) => {
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

        { isOpen
            ?
            <DetailsDropDownGrid>
            
                    <FaTicketAlt style={{color: "#fbdb37", fontSize: "200%"}}></FaTicketAlt>

          
            
                <DetailsGrid>
                    <NFTFooterBadge><p style={{fontSize: "1.2em", marginBottom: "0px"}}>{`42%`} Reinvestment</p></NFTFooterBadge>
                    <NFTFooterBadge><p style={{fontSize: "1.2em", marginBottom: "0px"}}>artist: sevenisalie</p></NFTFooterBadge>
                    <NFTFooterBadge><p style={{fontSize: "1.2em", marginBottom: "0px"}}>Remaining: {props.count}/42</p></NFTFooterBadge>
                </DetailsGrid>

            

            </DetailsDropDownGrid>
            :
            null
          
        }

        </>
    )
}

export default NFTFooter
