
import styled from "styled-components";
import {Page} from "../../components/Page"
import {ethers} from "ethers";
import React, {useEffect, useState} from "react";
import { useWeb3React } from "@web3-react/core";
import { addresses } from "../../config/addresses";
import { nftURI } from "../../config/uri";
import axios from "axios"
import {stopLossAbi} from "../../config/abis";
import {Container, Card, Button} from "react-bootstrap";
import {writeContract, userMint} from "../../utils/nft";
import { StyledDetailsButton } from "../../pages/pools/components/PoolCard"
import {HiChevronDoubleUp, HiChevronDoubleDown} from "react-icons/hi"

import {EthIcon, BitcoinIcon, DollarIcon} from "./components/CreateVault"

import {NFTFooter} from "./components/NFTFooter";
import {NFTCard} from "./components/NFTCard";
import MarketPageHeading from "./components/MarketPageHeading";

const MyNFTContainer = styled(Container)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 40px;
    margin-top: 40px;
    margin-bottom: 40px;
`

const MyNFTGrid = styled(Container)`
    margin-top: 25px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    justify-items: center;
    align-content: start;
    column-gap: 2px;
    row-gap: 20px;
    margin-bottom: 25px;

    @media (max-width: 768px) {
        flex-direction: column;
        grid-template-columns: auto;
        grid-template-rows: auto;
      }
  
`





const NFT = () => {
    const [stopLossContract, setStopLossContract] = useState('');
    const [userNFTData, setUserNFTData] = useState('');
    const {active, account, library, connector} = useWeb3React();
    const [transacting, setTransacting] = useState(false);

    useEffect( async () => {
        if (active) {
            const nfts = await getNFTs(account)
            console.log("user NFTS")
            console.log(nfts)
            setUserNFTData(nfts)
            
        } else {
            const noData = setUserNFTData('')
        }
    }, [active])

    useEffect( () => {
        if (active) {
            const nftctr = writeContract(
                active,
                library.getSigner(),
                account,
                userNFTData.contract,
                stopLossAbi,
            )
            .then( value => {
                setStopLossContract(value)
                console.log("setted stop tract")
                console.log(value)
                
            })
            
        } else {
            const noData = setStopLossContract('')
        }
    }, [userNFTData])


    const getNFTs = async (_account) => {
        const data = await axios.get(`https://cornoracleapi.herokuapp.com/stoploss/nfts/${_account}`)
        console.log("data from function")
        console.log(data)
        const darta = data.data
        return darta
    }
    

    
    
    
  

    const userNFTs = userNFTData.nfts
    if (userNFTs !== undefined && userNFTData !== null) {
        console.log(userNFTs)

        const mapUserNFTs = userNFTs.map((nft, index) => (

            <NFTCard
                mintData = {{account: account}}
                contract = {stopLossContract}
                id={index}
                nftId={nft}
                image={null}
                title={userNFTData.strategy}
            ></NFTCard>
 
        ));


        
        return (
        <>
        <Page>

            <MarketPageHeading/>

            <MyNFTGrid>

                {mapUserNFTs}
           
            </MyNFTGrid>

        </Page>

        </>
        )
    } else {
        return (
            <>
            <Page>

            <MarketPageHeading/>

    
                <MyNFTContainer>
    
                    No NFTs :(
               
                </MyNFTContainer>
    
            </Page>
    
            </>
            )
    }
}
export default NFT