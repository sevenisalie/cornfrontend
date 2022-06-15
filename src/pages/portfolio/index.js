import React from 'react'
import useGraphQuery from '../../hooks/useGraphQuery'
import { gql } from "graphql-request"
import PortfolioPageHeading from "./components/PortfolioPageHeading"
import UserSection from "./components/UserSection"
import TradeGrid from "./components/TradeGrid"


const Portfolio = () => {
    return (
        <>
        <PortfolioPageHeading /> 
        <UserSection />
        <TradeGrid />
        </>
    )
}

export default Portfolio
