import React, {useState, useEffect} from 'react'
import styled from "styled-components"
import {Container, Button, Card} from "react-bootstrap"
import TradingViewWidget, { Themes, IntervalTypes } from 'react-tradingview-widget';

const ChartContainer = styled(Container)`
    display: flex;
    flex-direction: column;
    height: 420px;
    width: 100%;
    align-items: center;
    justify-content: center;
`

export const Chart = () => {

    

    return (
        <>
            <ChartContainer>
                <TradingViewWidget
                    symbol="BINANCE:ETHUSDT"
                    interval={IntervalTypes.D}
                    theme={Themes.DARK}
                    locale="en"
                    autosize
                />
            </ChartContainer>
        </>
    )
}

export default Chart
