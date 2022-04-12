import React from 'react'
import styled from "styled-components"
import {FaArrowAltCircleRight} from "react-icons/fa"


const NFTHeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: auto;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
    margin-top: 2.4em;
    padding-left: 30px;
    padding-right: 30px;

`
const NFTHeaderText = styled.div`
    font-size: 2em;
    color: rgba(242, 242, 242, 0.90);
    align-self: center;
    margin-left: 0.2em;

    @media (max-width: 712px) {
        font-size: 1.7em;
    }
`
const NFTHeaderBreak = styled.hr`
    width: 66%;
    height: auto;
    border-top: 0.24em solid;
    color: rgba(242, 242, 242, 0.90);
    margin-left: 30px;

    @media (max-width: 712px) {
        width: auto;
        margin-right: 30px;
    }

`
const InstructionContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    margin-top: 3em;

    @media (max-width: 512px) {
        flex-direction: column;
    }
`

const InstructionCard = styled.div`
    height: 100%;
    width: auto;
    max-width: 50%;
    padding: 1.2em;
    
    backdrop-filter: blur(13px) saturate(155%);
    -webkit-backdrop-filter: blur(13px) saturate(155%);
    background-color: rgba(22, 22, 22, 0.96);
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.125);

    @media (max-width: 512px) {
        max-width: 80%;
        margin-top: 0.42em;
        margin-bottom: 0.42em;
    }

`

const InstructionList = styled.ul`

`
const InstructionListItem = styled.li`
    color: rgba(242, 242, 242, 0.99);
    font-size: 0.80em;
`
const InstructionText = styled.div`
    font-size: 0.8em;
    color: rgba(242, 242, 242, 0.99);
    margin-bottom: 0.7em;
    margin-right: 0.4em;
`

const InstructionArrow = styled(FaArrowAltCircleRight)`
    margin-left: 0.42em;
    margin-right: 0.42em;
    font-size: 1.3em;
`
const NFTHeaderGrid = (props) => {
    return (
        <>
            <InstructionContainer>
                <InstructionCard>
                    <InstructionList>
                        <InstructionText style={{fontSize: "1.3em", color: "#fbdb37"}}>Welcome to Corn Finance. </InstructionText>
                        <InstructionText>While our flagship equity router and algo-vaults are what make Corn Finance run, we still think traditional NFTs are totally f***ing awesome for trading and showing off.</InstructionText>
                        <InstructionText>Our in-house artist, sevenisalie, helps dish them up with collaboration from the community.  Get 'em while you can!</InstructionText>
                    </InstructionList>
                </InstructionCard>

                <InstructionArrow />

                <InstructionCard>

                    <InstructionList>
                    <InstructionText style={{fontSize: "1.1em", color: "#fbdb37"}}>
                        Cool Things to Know:
                    </InstructionText>
                    <InstructionListItem>NFTs are priced in MATIC</InstructionListItem>
                        <InstructionListItem>42% is sent to the Corn Treasury for dividends to future COB stakers. </InstructionListItem>
                        <InstructionListItem>Opensea, Rarible, and Twitter compatible </InstructionListItem>
                    </InstructionList>
                </InstructionCard>
            </InstructionContainer>


            <NFTHeaderContainer>
                <NFTHeaderText>
                    Recently Added
                </NFTHeaderText>
            </NFTHeaderContainer>

            <NFTHeaderBreak/>
            
        </>
    )
}

export default NFTHeaderGrid
