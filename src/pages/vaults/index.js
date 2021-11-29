import React, {useState, useEffect}from 'react'
import styled, { keyframes } from "styled-components"
import NavigationBar from "../../components/NavigationBar"
import {Page} from "../../components/Page"
import {Vault} from "./components/CreateVault"
import {BsArrowUpRight} from "react-icons/bs"
import {GiToken} from "react-icons/gi"
import {Card, Container, Button, Dropdown, Form} from "react-bootstrap"
import {HowToSection} from "./components/HowToSection"

const HeaderGridContainer = styled(Container)`
    margin-top: 66px;
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto;
    justify-items: center;
    align-content: start;
    column-gap: 2px;
    row-gap: 20px;
    margin-bottom: 25px;

    @media (max-width: 768px) {
        flex-direction: column;
        grid-template-columns: auto;
        grid-template-rows: auto;
        gap: 50px;
    }
`
const HeaderContentContainer = styled(Container)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    align-content: center;
    height: auto;
    width: 100%;
`

export const BigHeading = styled.h1`
    font-size: clamp(1rem, 4rem, 4rem);
    font-weight: 800;
    color:  #fbdb37;
    margin-bottom: 24px;
    @media (max-width: 768px) {
        font-size: clamp(1rem, 2.1rem, 3rem);
    }
    
`
export const LittleHeading = styled.h2`
    font-size: 130%;
    font-weight: 600;
    color: #fbfbfb;
    @media (max-width: 768px) {
        font-size: 1.0rem;
    }
    
`
const HeaderImage = styled.object`
    height: 500%;
    width: 100%;
    align-self: start;
    @media (max-width: 768px) {
        height: 250px;
    }
`

const BackgroundImage = styled.div`
    aspect-ratio: 960/300;
    width: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    background-image: url('/assets/images/homebackground.svg')
`

const HeaderButton = styled(Button)`
    border-radius: 15px;
    height: 50px;
    width: auto;
    background: #fbdb37;
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
export const HeaderButtonSecondary = styled(Button)`
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
const StupidSpan = styled.span`
    align-self: start;
`
const BodyGridContainer = styled(Container)`

    margin-top: 100px;
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto;
    justify-items: center;
    align-content: end;
    column-gap: 2px;
    row-gap: 20px;
    margin-bottom: 25px;

    @media (max-width: 768px) {
        flex-direction: column;
        grid-template-columns: auto;
        grid-template-rows: auto;
    }
`
export const BodyContentContainer = styled(Container)`
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    align-content: center;
    margin-bottom: 35px;
`
export const BodyBigHeading = styled(BigHeading)`
    font-weight: 600;
    font-size 190%;
    color: #fbdb37;
`
export const BodyLittleHeading = styled(LittleHeading)`
    font-weight: 400;
    font-size: 120%;
    color: #fbfbfb;
`
export const BodyContentCard = styled(Card)`
    align-self: center;
    height: auto;
    padding: 19px;
    width: 90%;
    background-color: #1D1E20;
    background-radius: 8px;
    box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
`
export const BodyContentCardContainer = styled(Container)`
    width: 100%
    height: auto;
    padding: 8px;
    justify-content: center;
    align-items: center;
    align-content: center;
    align-self: center;
`
const BodyImageContainer = styled(Container)`
    align-self: center;
    width: auto;
    height: 80%;
`

const SubHeaderGridContainer = styled(BodyGridContainer)`
    margin-top: 100px;
    grid-template-columns: auto auto auto;
`
const SubHeaderContentContainer = styled(Container)`
    display: flex;
    text-align: center;
    flex-direction: column;
    align-items: space-around;
    justify-content: center;
    align-content: center;
    border-left: 2px solid #cdcfd2;
    border-right: 2px solid #cdcfd2;
`
export const BuyButtonSecondary = styled(HeaderButtonSecondary)`
    align-self: center;
`
const TokenSubHeaderGridContainer = styled(SubHeaderGridContainer)`
    margin-top: 100px;
    grid-template-columns: auto;

`
const TokenSubHeaderContentContainer = styled(Container)`
    display: flex;
    text-align: center;
    flex-direction: column;
    align-items: space-around;
    justify-content: center;
    align-content: center;

`
const FooterImage = styled.img`
    width: 60%;
    height: auto;
    
    @media (min-width: 1200px) {
        margin-bottom: 100px;
    }
    
`
const rotateTwo = keyframes`
    from {
        transform: rotate(0deg) translate(0, 0) translate(0, 0);
    }
    to {
        transform: rotate(360deg) translate(7%, 15%) translate(-7%, -15%);
    }
    
`
const rotateThree = keyframes`
    0% {
        transform: translateX(0px) translateY(0px);
    }
    50% {
        transform: translateX(-22px) translateY(-22px);
    }
    100% {
        transform: translateX(0px) translateY(0px);
    }
    
`
const FooterImageTwo = styled.img`
    width: 20%;
    height: auto;
    animation: ${rotateTwo} infinite 10s linear;
    @media (min-width: 1200px) {
        margin-bottom: 100px;
    }
    
`
const FooterImageThree = styled.img`
    width: 20%;
    height: auto;
    animation: ${rotateThree} infinite 9s ease-in-out;
    transform: rotate(180deg);
    @media (min-width: 1200px) {
        margin-bottom: 100px;
    }

    
`
export const Home = () => {
 
    return (
        <>
        <Page>
            <HeaderGridContainer>
                <HeaderContentContainer>
                    <BigHeading>Beef-up with a Corn-fed portfolio</BigHeading>
                    <LittleHeading>Buy and Sell Algo-NFTs that can automate your on-chain trading strategies</LittleHeading>
                    <StupidSpan>
                    <HeaderButton>Mint Now</HeaderButton>
                    <HeaderButtonSecondary>Learn</HeaderButtonSecondary>
                    </StupidSpan>
                </HeaderContentContainer>
                <HeaderContentContainer style={{alignSelf: "center"}}>
                    <HeaderImage type="image/svg+xml" data="/assets/images/MovingCircles.svg">svg-animation</HeaderImage>
                </HeaderContentContainer>
            </HeaderGridContainer>
            
            
            <SubHeaderGridContainer style={{marginTop: "180px", marginBottom: "140px"}}>
                <SubHeaderContentContainer>
              
                    <h2 style={{color: "#fbdb37", fontWeight: "600"}}>COB Token</h2>
                    <BuyButtonSecondary>
                        Buy <BsArrowUpRight />
                    </BuyButtonSecondary>
                </SubHeaderContentContainer>
                <SubHeaderContentContainer>
                    <h2 style={{color: "#fbdb37", fontWeight: "600"}}>Market Cap</h2>
                    <h2>100,344,104</h2>
                </SubHeaderContentContainer>
                <SubHeaderContentContainer>
                    <h2 style={{color: "#fbdb37", fontWeight: "600"}}>Emissions Rate</h2>
                    <h2>0.4/block</h2>
                </SubHeaderContentContainer>
            </SubHeaderGridContainer>

            <BodyGridContainer style={{marginBottom: "85px"}}>
                <BodyContentContainer>
                    <BodyContentCard>
                        <BodyContentCardContainer>
                            <BodyBigHeading>Accumulator Distributor</BodyBigHeading>
                            <hr></hr>
                            <BodyLittleHeading>
                                Our smart contract is built on the principals of institutional algorithmic investing. Accumulate tokens at low prices and Distribute them at higher prices.
                            </BodyLittleHeading>
                            <BodyLittleHeading style={{color: "#fbdb37", fontWeight: "600"}}>
                                Easy right? 
                            </BodyLittleHeading>
                        </BodyContentCardContainer>
                    </BodyContentCard>
                </BodyContentContainer>
                <BodyContentContainer>
                    <BodyBigHeading style={{color: "#fbdb37", fontWeight: "800", fontSize: "270%"}}>We're bringing Advanced Orders to DeFi</BodyBigHeading>
                </BodyContentContainer>
            </BodyGridContainer>

            
                <BodyContentContainer>
                    <HowToSection>

                    </HowToSection>
                </BodyContentContainer>
        

            <BodyGridContainer>
                <BodyContentContainer>
                    <BodyImageContainer>
                    <FooterImageTwo style={{width: "100%"}} src={`/assets/images/Sircle.svg`}></FooterImageTwo>
                    </BodyImageContainer>
                </BodyContentContainer>

                <BodyContentContainer>
                    <BodyBigHeading style={{fontSize: "310%"}}>Smart Aggregation and Routing</BodyBigHeading>
                    <BodyLittleHeading>We route orders through multiple DEX's to ensure ample liquidity and reduce slippage.</BodyLittleHeading>
                </BodyContentContainer>
            </BodyGridContainer>

            <BodyGridContainer>

                <BodyContentContainer>
                    <BodyLittleHeading style={{color: "#fbfbfb", fontWeight: "400", fontSize: "180%", textAlign: "center"}}>
                        Many AMMs lack stop-losses and other conditional order-types. We aim to fix that.</BodyLittleHeading>
                </BodyContentContainer>
                <BodyContentContainer>
                    <BodyContentCard>
                        <BodyContentCardContainer>
                            <BodyBigHeading>Dozens of Strategies</BodyBigHeading>
                            <hr></hr>
                            <BodyLittleHeading>
                                Everything from stop losses to advanced bracket orders based on technical analytics of price.
                            </BodyLittleHeading>
                        </BodyContentCardContainer>
                    </BodyContentCard>
                </BodyContentContainer>
            </BodyGridContainer>

            <TokenSubHeaderGridContainer>
                <TokenSubHeaderContentContainer style={{alignSelf: "center"}}>
                    <GiToken style={{alignSelf: "center", color: "#fbdb37", fontSize: "500%", marginBottom: "30px"}}/>
                    <h2 style={{color: "#fbdb37", fontWeight: "600", fontSize: "240%", marginBottom: "50px"}}>100% Fair Launch Governance Token</h2>
                    <BodyContentCard>
                        <BodyContentCardContainer>
                    <p>Stake liquidity to earn COB token.  No pre-sale, no whitelist, one-hundred percent community driven staking.</p>
                    <hr></hr>
 
                    <p>COB will be used as a governance tool to vote on new strategies and proposals for the protocol. The fair launch mechanism ensures that no group controls the protocol from the start.</p>
                    </BodyContentCardContainer>
                    </BodyContentCard>
                    <BuyButtonSecondary>Stake <BsArrowUpRight/></BuyButtonSecondary>


                </TokenSubHeaderContentContainer>
            </TokenSubHeaderGridContainer>


        <Container style={{height: "460px", width: "100%", display: "flex", flexDirection: "row", justifyContent: "center", marginTop: "100px", marginBottom: "20px"}}>

      
        <FooterImage src={'/assets/images/Docs.svg'}></FooterImage> 
   
        <FooterImageTwo style={{alignSelf: "flex-start"}} src={'/assets/images/Sircle.svg'}></FooterImageTwo>
        <FooterImageThree src={'/assets/images/Sircle.svg'}></FooterImageThree>
        
        

        </Container>
        </Page>
        </>
    )
}

export default Home
