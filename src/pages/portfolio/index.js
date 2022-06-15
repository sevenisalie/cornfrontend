import React from 'react'

import PortfolioPageHeading from "./components/PortfolioPageHeading"
import UserSection from "./components/UserSection"
import TradeGrid from "./components/TradeGrid"
import HowToSection from "./components/HowToSection"

const Portfolio = () => {
    return (
        <>
        <PortfolioPageHeading />
        <UserSection />
        <HowToSection />
        <TradeGrid />
        </>
    )
}

export default Portfolio
