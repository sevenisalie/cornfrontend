import React, {useState, useEffect} from 'react'
import styled from "styled-components"

import {GiCorn} from "react-icons/gi"
import { FaArrowAltCircleRight } from 'react-icons/fa'

const EntryContainer = styled.div`
    display: ${props => props.loading ? `none` : `flex`};
    flex-direction: row;
    width: 100%;
    height: auto;
    justify-content: center;
    align-content: center;
    align-items: center;
`
const RouteCard = styled.div`
    align-self: center;
    display: flex;
    flex-direction: column;
    align-content: center;
    align-items: center;
    justify-content: center;
    width: 90%;
    height: auto;
    backdrop-filter: blur(16px) saturate(200%);
    -webkit-backdrop-filter: blur(16px) saturate(200%);
    background-color: rgba(35, 34, 52, 0.91);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.125);
    -webkit-border-bottom-right-radius: 19px;
    -webkit-border-bottom-left-radius: 19px;
    -moz-border-radius-bottomright: 19px;
    -moz-border-radius-bottomleft: 19px;
    border-bottom-right-radius: 19px;
    border-bottom-left-radius: 19px;
`
const RouteBadge = styled.div`
    align-self: center;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-content: center;
    align-items: center;
    justify-content: center;
    width: 90%;
    height: auto;
    font-size: 1.2em;
    border: 2px solid rgba(251, 219, 55, 0.86);
    border-radius: 17px;
    padding: 0.82em;
    margin-bottom: 0.42em;
`
const RouteSymbolText = styled.div`
    font-size: 1.1em;
    color: rgba(242, 242, 242, 0.87);
   
`

const RouteTokenImage = styled.img`
    width: 1.9em;
    height: auto;
`
const CardRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    width: 100%;
    height: auto;
    color: rgba(242, 242, 242, 0.69);
    padding-left: 1em;
    padding-right: 1em;
    margin-bottom: 0.3em;

`
const RouteText = styled.div`
    font-size: 0.96em;
    font-weight: 400;
    color: rgba(242, 242, 242, 0.45);
`

const RouteHR = styled.hr`
    width: 100%;
    color: rgba(242, 242, 242, 0.68);
    height: 6px;
`

const TokenPath = (props) => {
    const [loading, setLoading] = useState(true)
    const [router, setRouter] = useState('')
    const [paths, setPaths] = useState('')
    const [price, setPrice] = useState('')
   



    useEffect(() => {
        const PATHS = props.path.path
        const ROUTER = props.path.router
        const PRICE = props.path.amountOut
        const isLoading = Object.keys(props.path).length === 0



        setPaths(PATHS)
        setRouter(ROUTER)
        setPrice(PRICE)
        setLoading(isLoading)
        console.log("POOOOPIEE PEE PEE")
        console.log(props.state)
        if (props.state.setAmountIn === "") {
            setPrice('')
            setRouter('')
            setLoading(true)
        }
    }, [props.path, props.state.setAmountIn])
    

    let path;
    if (!loading) {
        path = paths.map( (route, index, arr) => {
            const isLast = arr.length - 1 === index 
            return (
            
            <>
                <RouteTokenImage src={route.logoURI} style={{marginTop: "0.7em"}}/>
                <RouteSymbolText style={{marginLeft: "0.3em", marginTop: "0.7em"}}>{route.symbol}</RouteSymbolText>
                { isLast ? null : <FaArrowAltCircleRight style={{marginTop: "0.7em", marginRight: "1em", marginLeft: "1em", fontSize: "1.1em", color: "rgba(251, 219, 55, 0.69)"}} ></FaArrowAltCircleRight >}
                
       
            </>
        )})
    }



    return (
        <>
            <EntryContainer loading={loading}>
                <RouteCard>

                    <CardRow style={{marginTop: "1.02em"}}>
                        {/* PRICE */}
                        <RouteText>
                            {`Corn Price`}
                            <GiCorn style={{marginLeft: "0.3em"}}/>
                        </RouteText>
                        <RouteText>
                        {loading ? null : price }
                   

                        </RouteText>
                    </CardRow>

                    <CardRow>
                        {/* PRICE IMPACT */}
                        <RouteText>
                            {`Price Impact`}
                        </RouteText>
                        <RouteText>
                            {"0.01%"}
                        </RouteText>
                    </CardRow>

                    <CardRow>
                        {/* RouTe */}
                        <RouteText>
                            {`Best Route`}
                        </RouteText>
                        <RouteText>
                            {loading ? null : router.name}
                        </RouteText>
                    </CardRow>

                    <RouteHR></RouteHR>
                    <CardRow>
                        {/* ROUTE */}
                    </CardRow>
                    <RouteBadge>
                        {loading ? null : path }
                    </RouteBadge>
                </RouteCard>
            </EntryContainer>
        </>
    )
    
}

export default TokenPath
