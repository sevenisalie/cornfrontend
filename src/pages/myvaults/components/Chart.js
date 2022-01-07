import React, {useState, useEffect} from 'react'
import styled from "styled-components"
import {Container, Button, Card} from "react-bootstrap"
import TradingViewWidget, { Themes, IntervalTypes } from 'react-tradingview-widget';

const ChartContainer = styled(Container)`
    margin-top: 12px;
    border-radius: 25px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    height: 420px;
    width: 100%;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(12px) saturate(149%);
    -webkit-backdrop-filter: blur(0px) saturate(149%);
    background-color: rgba(29, 30, 32, 0.57);
    border: 1px solid rgba(255, 255, 255, 0.125);
    box-shadow: 6px 6px 8px 0 rgba(0, 0, 0, 0.3);
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
