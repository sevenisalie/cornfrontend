import React, {useState} from 'react'

import PortfolioPageHeading from "./components/PortfolioPageHeading"
import UserSection from "./components/UserSection"
import TradeGrid from "./components/TradeGrid"
import HowToSection from "./components/HowToSection"
import {HeaderButtonSecondary} from "../vaults/index"
import styled from "styled-components"



const SectionContainer = styled.div`
    display: flex;
    flex-direction: row;
    height: max-content;
    margin-left: 2em;
    width: 100%;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    padding-top: 2.5em;
    padding-bottom: 0.5em;
    column-gap: 2.42em;
`

export const PoolHeaderText = styled.div`
    font-size: 2em;
    color: rgba(242, 242, 242, 0.90);
    margin: 0 0 0 0;
    
    @media (max-width: 712px) {
        font-size: 1.7em;
    }
`

export const LineBreak = styled.hr`
    width: 66%;
    height: auto;
    border-top: 0.24em solid;
    color: rgba(242, 242, 242, 0.90);
    margin-left: 30px;
    margin-top: 1.8em;
    margin-bottom: 2em;

    @media (max-width: 712px) {
        width: auto;
        margin-right: 30px;
    }
`

const Portfolio = () => {
    const [tradeStatus, setTradeStatus] = useState(true)

    return (
        <>
        <PortfolioPageHeading />
        <UserSection />
        
        <SectionContainer>
        <PoolHeaderText>
            {`My Trades`}
        </PoolHeaderText>

        <HeaderButtonSecondary style={{margin: "0 0 0 0", alignSelf: "center"}} onClick={(() => setTradeStatus(true))}
        >Open</HeaderButtonSecondary>
        <HeaderButtonSecondary style={{margin: "0 0 0 0", alignSelf: "center"}} onClick={(() => setTradeStatus(false))}
        >Closed</HeaderButtonSecondary>
        
        </SectionContainer>
        <LineBreak />
        
        <TradeGrid tradeStatus={tradeStatus}/>
        </>
    )
}

export default Portfolio
