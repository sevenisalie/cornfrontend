import React from 'react'
import styled from "styled-components"
import {Container, Button, Card} from "react-bootstrap"
import {BiPurchaseTagAlt} from "react-icons/bi"
import {RiRefund2Line, RiFundsLine} from "react-icons/ri"
import CardBackground from "../../../assets/images/CardBackground.svg"

//components
import {BodyContentCard, BodyBigHeading, BodyContentCardContainer, BodyLittleHeading} from "../index"

const ContainerRow = styled(Container)`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: auto;
    width: 100%;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`
const ContainerColumn = styled(Container)`
    display: flex;
    flex-direction: column;
    align-content: center;
`
const CardOne = styled(Card)`

    align-self: center;
    height: auto;
    padding: 19px;
    width: 100%;
    background-color: #1D1E20;
    background-radius: 8px;
    box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
    transform: rotate(-20deg);
    left: -3%;
    width: 30%;
    backdrop-filter: blur(6px) saturate(200%);
    -webkit-backdrop-filter: blur(6px) saturate(200%);
    background-color: rgba(1, 1, 1, 0.72);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.125);
    

    @media (max-width: 768px) {
        width: 100%;
        transform: rotate(0deg);
        left: 0%;
        top: -22px;
    }

`
const CardTwo = styled(Card)`
    align-self: center;
    height: auto;
    padding: 19px;
    width: 100%;
    background-color: #1D1E20;
    background-radius: 8px;
    box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
    transform: rotate(8deg);
    backdrop-filter: blur(6px) saturate(200%);
    -webkit-backdrop-filter: blur(6px) saturate(200%);
    background-color: rgba(1, 1, 1, 0.72);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.125);

    top: -38px;
    width: 30%;
    

    @media (max-width: 768px) {
        width: 100%;
        top: 0px;
    }
` 
const CardThree = styled(Card)`
    align-self: center;
    height: auto;
    padding: 19px;
    width: 100%;
    background-color: #1D1E20;
    background-radius: 8px;
    box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
    transform: rotate(-8deg);
    right: -3%;
    width: 30%;
    backdrop-filter: blur(6px) saturate(200%);
    -webkit-backdrop-filter: blur(6px) saturate(200%);
    background-color: rgba(1, 1, 1, 0.72);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.125);

    @media (max-width: 768px) {
        width: 100%;
        transform: rotate(0deg);
        right: 0%;
        bottom: -22px;

    }
`
const BigCard = styled(Card)`
    background-image: url(${CardBackground});
    background-position: relative;
    border: none;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    border-radius: 9px;

`

export const HowToSection = () => {
    return (
        <>
            <BigCard>

            <ContainerRow>
                <CardOne >
                    <BodyContentCardContainer>
                        <BodyBigHeading style={{fontSize: "200%"}}>1. Purchase a Vault</BodyBigHeading>
                        <hr></hr>
                        <BodyLittleHeading style={{fontSize: "100%"}}>
                            Purchase a vault from the marketplace to get started.  Each Vault has a unique trading algorithm, you can check it's details to learn more.
                        </BodyLittleHeading>
                        <BodyLittleHeading style={{textAlign: "center", color: "#fbdb37", fontSize: "150%", fontWeight: "600"}}>
                        <BiPurchaseTagAlt/> 
                        </BodyLittleHeading>
                    </BodyContentCardContainer>
                </CardOne>

                <CardTwo>
                    <BodyContentCardContainer>
                        <BodyBigHeading style={{fontSize: "200%"}}>2. Deposit Funds</BodyBigHeading>
                        <hr></hr>
                        <BodyLittleHeading style={{fontSize: "100%"}}>
                            Deposit any amount of funds into the vault that you'd like to trade.  If you're swapping 10 ETH for USDC, then you would deposit 10 ETH into your vault.
                        </BodyLittleHeading>
                        <BodyLittleHeading style={{textAlign: "center", color: "#fbdb37", fontSize: "150%", fontWeight: "600"}}>
                        <RiRefund2Line style={{textAlign: "center"}}/>
                        </BodyLittleHeading>
                    </BodyContentCardContainer>
                </CardTwo>
                </ContainerRow>

                <ContainerRow style={{justifyContent: "center"}}>
                <CardThree>
                    <BodyContentCardContainer>
                        <BodyBigHeading style={{fontSize: "200%"}}>3. Relax</BodyBigHeading>
                        <hr></hr>
                        <BodyLittleHeading style={{fontSize: "100%"}}>
                            We check conditions and route orders every block. So long as your conditions are met then the swaps will automatically happen. 
                        </BodyLittleHeading>
                        <BodyLittleHeading style={{textAlign: "center", color: "#fbdb37", fontSize: "150%", fontWeight: "600"}}>
                        <RiFundsLine/>
                        </BodyLittleHeading>
                    </BodyContentCardContainer>
                </CardThree>
            </ContainerRow>
            </BigCard>

        </>
    )
}

export default HowToSection
