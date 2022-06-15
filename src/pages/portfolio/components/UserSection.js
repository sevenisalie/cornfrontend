import React, {useState, useEffect} from 'react'
import styled from "styled-components"
import { gql } from "graphql-request"
import { portfolioTotalsGraphQuery } from "../../../queries/portfolioQueries"
import { cleanPortfolioTotalData } from "../../../utils/portfolio"
import { toFixed } from "../../../utils/nft"
import useFetchPortfolio from "../../../hooks/useFetchPortfolio"
import useGraphQuery from "../../../hooks/useGraphQuery"
import { useWeb3React } from "@web3-react/core";
import ChartWidget from "./ChartWidget"

const SectionContainer = styled.div`
    display: flex;
    flex-direction: row;
    height: 382px;
    width: 100%;
    justify-content: space-around;
    align-items: center;
    align-content: center;
    padding: 1.5em;
    column-gap: 0.42em;
    @media (max-width: 742px) {
        flex-direction: column;
        row-gap: 0.8em;
        height: 568px;
    }
`

const CardOne = styled.div`
    border-radius: 12px;
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 70%;
    margin-top: 2px;
    margin-bottom: 2px;
    background: url(/assets/images/portfoliobg.png) no-repeat center center fixed; 
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    box-shadow: var(--shadow-elevation-medium);
   
`
const CardTwo = styled.div`
    border-radius: 50px;
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 30%;
    margin-top: 2px;
    margin-bottom: 2px;
    background: url(https://via.placeholder.com/150) no-repeat center center fixed; 
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    box-shadow: var(--shadow-elevation-medium);
`
const CardContentContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 75%;
    height: 100%;
    justify-content: space-between;    
    @media (max-width: 742px) {
        flex-direction: column;
    }
`
const CardOneImage = styled.img`
    width: auto;
    height: 380px;
    border-radius: 0 12px 12px 0;
    opacity: 100%;
    padding-top: 5em;
    align-self: flex-end;
`
const CardTwoImage = styled.img`
    height: auto;
    width: auto;
    border-radius: 50px;
    opacity: 70%;
`
const InfoGrid = styled.div`
    display: grid; 
    grid-template-columns: 0.7fr 1.7fr 0.6fr; 
    grid-template-rows: 1fr 1fr; 
    gap: 0.5em 0.5em; 
    grid-template-areas: 
    ". Info ."
    "Tokens Tokens Tokens";
    width: 100%;
    height: auto;
    place-items: center;

    @media (max-width: 742px) {
        
    }
`
const TokenLogoContainer = styled.div`
    grid-area: Tokens;
    display: flex;
    flex-direction: column;
    width: max-content;
    height: max-content;
    background-color: transparent;
    border-radius: 18px;
    justify-self: center;
    padding: 0.3em;
`
const TokenLogoHexContainer = styled.div`
    display: grid; 
    grid-template-columns: auto auto auto; 
    grid-template-rows: auto; 
    gap: 0.4px 0.8px; 
    grid-template-areas: 
    ". . ."; ;
    border: solid 2px rgba(166, 202, 157, 1);
    border-radius: 22px;
    padding: 0.3em;
`
const TokenLogoImage = styled.img`
    width: 3.5em;
    height: auto;
`

const TradeInfoContainer = styled.div`
    grid-area: Info;
    display: flex;
    flex-direction: column;
    align-content: center;
    align-items: center;
    justify-content: center;
    background-color: rgba(29, 30, 32, 0.88);
    border: 1px solid rgba(255, 255, 255, 0.125);
    border-radius: 22px;
    box-shadow: var(--shadow-elevation-low);
    padding: 1.3em;
    align-self: center;
`
const TradeInfoRow = styled.div`
    display: flex;
    flex-direction: column;
    align-content: flex-start;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: auto;
    align-self: center;
 
`
const InfoText = styled.p`
    font-size: 1em;
    color: rgba(242, 242, 242, 0.87);
    font-weight: 600;
    margin: 0px;
`
const ValueText = styled.p`
    font-size: 1.1em;
    color: rgba(201, 255, 187, 1);
    font-weight: 700;
    margin: 0px;
`


const UserSection = () => {
    const {account, library} = useWeb3React()
    const [query, setQuery] = useState("")
    const {data:portfolioData} = useGraphQuery(query)
    const [portfolio, setPortfolio] = useState(null)

    useEffect(() => {
        if (account) {
            const q = portfolioTotalsGraphQuery(account)
            setQuery(q)
        }
    }, [account])

    useEffect(() => {
        const fetchData = () => {
            const data = cleanPortfolioTotalData(portfolioData.erc20S)
            setPortfolio(data)
        }
        if ( portfolioData ) {
            fetchData()
        }
    }, [portfolioData])
    
    // const {data} = useFetchPortfolio(account)
    let mappedTokens;
    if (portfolio) {
        mappedTokens = portfolio.allTokenLogos.map( (token) => {
            return (<TokenLogoImage src={token} />)
        })
    }

    return (
        <>
        {/* <pre>
            {JSON.stringify(portfolio, null, 2)}
        </pre> */}
           <SectionContainer>
  
                   <CardContentContainer >
                           <ChartWidget />
                           <InfoGrid>
                                <TokenLogoContainer>
                                    <TokenLogoHexContainer>
                                        {
                                            mappedTokens
                                        }
                                    </TokenLogoHexContainer>
                                </TokenLogoContainer>
                                <TradeInfoContainer>
                                    <TradeInfoRow>
                                        <InfoText>Open Volume:</InfoText>
                                        <ValueText >${portfolio && toFixed(portfolio.totalValue, 6)}</ValueText>
                               
                                        <InfoText>Open Interest</InfoText>
                                        <ValueText>{portfolio && portfolio.tradeCount}</ValueText>
                                    </TradeInfoRow>
                                </TradeInfoContainer>
                           </InfoGrid>
                   </CardContentContainer>
 
               {/* <CardTwo>
               
               </CardTwo> */}
            </SectionContainer> 
        </>
    )
}

export default UserSection
