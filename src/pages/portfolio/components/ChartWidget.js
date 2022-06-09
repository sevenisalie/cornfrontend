import React from 'react'
import TradingViewWidget, { Themes } from 'react-tradingview-widget';

const ChartWidget = () => {
    return (
        <>
            <TradingViewWidget
            symbol="BINANCE:ETHUSDT"
            theme={Themes.DARK}
            locale="en"
            autosize
             />
        </>
    )
}

export default ChartWidget
