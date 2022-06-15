import React from 'react'
<<<<<<< HEAD
import useGraphQuery from '../../hooks/useGraphQuery'
import { gql } from "graphql-request"
import PortfolioPageHeading from "./components/PortfolioPageHeading"
import UserSection from "./components/UserSection"
import TradeGrid from "./components/TradeGrid"

=======

import PortfolioPageHeading from "./components/PortfolioPageHeading"
import UserSection from "./components/UserSection"
import TradeGrid from "./components/TradeGrid"
import HowToSection from "./components/HowToSection"
>>>>>>> 7943e750b2d79d2eac508df4145450ec893630c1

const Portfolio = () => {
    return (
        <>
<<<<<<< HEAD
        <PortfolioPageHeading /> 
        <UserSection />
=======
        <PortfolioPageHeading />
        <UserSection />
        <HowToSection />
>>>>>>> 7943e750b2d79d2eac508df4145450ec893630c1
        <TradeGrid />
        </>
    )
}

export default Portfolio
