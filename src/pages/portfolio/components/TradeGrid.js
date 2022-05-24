import React from 'react'
import styled from "styled-components"

const TradeGridContainer = styled.div`
    display: grid;
    width: 100%;
    height: auto;
    grid-template-columns: auto auto auto;
    grid-template-rows: auto;
    justify-items: center;
    align-content: start;
    column-gap: 1em;
    row-gap: 4.20em;
    padding: 2.5em;
`

const TradeCard = styled.div`
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    height: 258px;
    width: 100%;
    backdrop-filter: blur(12px) saturate(149%);
    -webkit-backdrop-filter: blur(0px) saturate(149%);
    background-color: rgba(29, 30, 32, 0.57);
    border: 1px solid rgba(255, 255, 255, 0.125);
    box-shadow: var(--shadow-elevation-medium);
`
const CardContentContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
`
const CardImage = styled.img`
    height: 100%;
    width: 30%;
    border-radius: 20px 0 0 20px;
    opacity: 70%;
`

const TradeGrid = () => {
    const mockTrades = ["LIMIT", "LIMIT", "LIMIT", "LIMIT", "LIMIT", "LIMIT", "LIMIT", "LIMIT", "LIMIT"]
    const trades = mockTrades.map(( trade ) => (
        <TradeCard>
            <CardContentContainer>
                <CardImage src={"https://via.placeholder.com/150"}></CardImage>
                <div style={{width: "70%", height: "100%", padding: "2em"}}>trade_data</div>
            </CardContentContainer>
        </TradeCard>
    ))
    return (
        <>
        <TradeGridContainer>
            {trades}
        </TradeGridContainer>
        </>
    )
}

export default TradeGrid
