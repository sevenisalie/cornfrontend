import React from 'react'
import styled from "styled-components"
import {Container, Card, Button} from "react-bootstrap";


const HeadingContainer = styled(Container)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 15px;
`

const HeadingBackground = styled(Card)`
    height: auto;
    width: 100%;
    padding: 20px;
    background-color: #1D1E20;
    box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
`

const BigHeading = styled.h1`
    font-size: 280%;
    font-weight: 800;
    color:  #fbdb37;
    
`
const LittleHeading = styled.h2`
    font-size: 200%;
    font-weight: 600;
    color: #fbfbfb;
    
`
export const NFTHeading = () => {
    return (
        <>
           <HeadingContainer>
                <HeadingBackground>
                    <BigHeading>Strategy Marketplace</BigHeading>
                    <LittleHeading>Acquire new strategies by minting an NFT to suit your trading style</LittleHeading>
                </HeadingBackground>
            </HeadingContainer>            
        </>
    )
}

export default NFTHeading
