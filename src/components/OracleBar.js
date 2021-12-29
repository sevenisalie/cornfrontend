import React, {useState, useEffect} from "react"
import {ethers} from "ethers";
import styled from "styled-components"
import {Button, Container, Card} from "react-bootstrap"
import {aggregatorV3InterfaceABI} from "../config/abis"
import {addresses} from "../config/addresses"
import {writeContract, fetchPoolAllowance, getTokenStakeBalance, fetchTokenStakeBalance} from "../utils/nft";
import {fetchUserPoolData, mapPendingToOriginalData, getPoolBalance} from "../utils/fetchUserData";
import { useWeb3React } from "@web3-react/core";
import Marquee from "react-fast-marquee";

import {BsApple} from "react-icons/bs"
import OracleCard from "./OracleCard"


const BarContainer = styled(Container)`

    display: flex;
    flex-direction: row;
    height: auto;
    width: 100%;
    justify-content: center;
    align-items: center;
`

const BarCard = styled(Card)`
    margin-top: 25px;
    border: 0px;
    height: auto;
    width: auto;
    background-color: transparent;
    
`
const BarContentContainer = styled(Container)`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    align-content: center;
    height: auto;
    width: auto;
`
const BarContentColumn = styled(Container)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-content: center;
    height: auto;
    width: auto;
`

export const OracleBar = () => {

    const [oracle, setOracle] = useState('')
    const {active, account, library, connector} = useWeb3React();

    const [time, setTime] = useState(new Date().toLocaleTimeString())

    const [price, setPrice] = useState([0,0,0])

    const refreshTime = () => {
        setTime(new Date().toLocaleTimeString())
    }

    const fetchOracles = async () => {
        const assets = addresses.oracles.map( oracle => oracle)
        
       
    try {
        const contracts = assets.map( async (asset) => {

            const ctr = await writeContract(
                active, 
                library.getSigner(), 
                account, 
                asset.address, 
                aggregatorV3InterfaceABI
                )
            
            return {
                TOKEN: asset.symbol,
                CONTRACT: ctr
            }
        })
        const data = await Promise.all(contracts)

        return data

    } catch (err) {
        console.log(err)
    }
        

        
    }

    const getPrices = async () => {
        const ctrs = await fetchOracles()

        const prices = ctrs.map( async (ctr) => {
            const price = await ctr.CONTRACT.latestRoundData()
            return {
                ...ctr,
                price
            }
        })

        const data = await Promise.all(prices)

        return data

    }

    const mapPriceData = async (priceData) => {

        const prices = priceData.map( (data) => {
            const id = ethers.utils.formatUnits(data.price.roundId, 0)
            const answer = ethers.utils.formatUnits(data.price.answer, 8)
            
            const timestamp = ethers.utils.formatUnits(data.price.updatedAt, 0)
            const d = Date(timestamp*1000);
            return {
                ...data,
                ID: id,
                time: d,
                price: answer
            }
        })


        const data = await Promise.all(prices)

        return data
}

    const refreshPrice = async () => {
        const getData = await getPrices()
        const gotData = await mapPriceData(getData)
        console.log(gotData)
        setPrice(gotData)
    }

    

    useEffect(() => {
        const timer = setInterval(refreshPrice, 10000)
        return () => {
            clearInterval(timer)
        }
    }, [account])

    const oracleCards = price.map( (p) => (
        
        <BarContentContainer>
            <OracleCard symbol={p.TOKEN} price={p.price} />
        </BarContentContainer>
    ))

    console.log(price[0])
    return (
        <div>
            <BarContainer>
                <BarCard prices={price}>

                    <BarContainer>

                        <Marquee
                            gradient={false}
                        >
                            {oracleCards}
                        </Marquee>
                        

                        
                    </BarContainer>

                </BarCard>
            </BarContainer>
        </div>
    )
}

export default OracleBar
