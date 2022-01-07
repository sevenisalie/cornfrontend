
import styled from "styled-components";
import {Page} from "../../components/Page"
import {ethers} from "ethers";
import React, {useEffect, useState} from "react";
import { useWeb3React } from "@web3-react/core";
import { addresses } from "../../config/addresses";
import { nftURI } from "../../config/uri";


import axios from "axios"
import {nftABI, stopLossAbi} from "../../config/abis";
import {Container, Card, Button} from "react-bootstrap";
import {writeContract, userMint} from "../../utils/nft";
import {VaultNFTCard} from "./components/VaultNFTCard";
import VaultsPageHeading from "./components/VaultsPageHeading"
import {OracleBar} from "../../components/OracleBar";
import {VaultNFTFooter} from "./components/VaultNFTFooter";
import {Chart} from "./components/Chart";
import Marquee from "react-fast-marquee";
import {MultiplierBadge} from "../pools/components/Badges"
import {FaCircle, FaRegCircle, FaTicketAlt} from "react-icons/fa"


import {EthIcon, BitcoinIcon, DollarIcon} from "../nftgallery/components/CreateVault"

const SoManyContainers = styled(Container)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 200px;

`
const VaultChartGrid = styled(Container)`
    display: grid;
    z-index: 999;
    grid-template-columns: auto
    grid-template-rows: auto auto;
    place-items: center;
`

const MyVaultContainer = styled(Container)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-top: 40px;
`
const MyVaultRow = styled(Container)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
`
const VaultGrid = styled(Container)`
    margin-top: 25px;
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: 100%;
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

const MyVaultCard = styled(Card)`
    padding: 10px;
    border-radius: 50px;
    position: relative;
    border-color: transparent;
    z-index: 0;
    height: auto;
    width: 100%;
    
    background-color: transparent;
    
    box-shadow: 12px 12px 16px 0 rgba(0, 0, 0, 0.3), -10px -6px 12px 0 rgba(103, 107, 114, 0.1);
    width: 100%;

`
const CardGrid = styled(Container)`
    margin-top: 25px;
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: 100%;
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
const MyVaultCardContainer = styled(Container)`
    display: flex;
    flex-direction: row;
    flex-wrap: no-wrap;
    align-content: space-around;
    justify-content: space-around;
    gap: 8px;
    width: 100%;

`
const PriceTargetRow = styled(Container)`
    display: flex;
    flex-direction: row;
    padding: 0px;
    width: auto;
    margin: 0px;
    align-items: center;
    justify-content: center;
    gap: 2px;
`

const CardHeader = styled.h2`
    font-size: 220%;
    font-weight: 600;
    color: #fbfbfb;
    text-justify: center;
    align-self: center;
`
const DetailsCard = styled(Card)`
    border-radius: 25px;
    margin-bottom: 18px;
    height: 100%;
    width: 100%;
    background-color: transparent;
    
    box-shadow: 12px 12px 16px 0 rgba(0, 0, 0, 0.3), -10px -6px 12px 0 rgba(103, 107, 114, 0.1);
`

const MintButton = styled(Button)`
    border-radius: 15px;
    height: 50px;
    width: 20%;
    background: #fbdb37;
    border-color: #fce984;
    border-width: 3px;
    color: #FFFFE0;
    font-size: 20px;
    font-weight: 600;
    margin-top: 20px;


    &:hover {
        background: #fbdb37;
        border-color: #dfbb05;
        border-width: 3px;
        color: #dfbb05;
        font-size: 20px;
        font-weight: 800;
    }

    &:focus {
        background: #fbdb37;
        border-color: #dfbb05;
        border-width: 3px;
        color: #dfbb05;
        font-size: 20px;
        font-weight: 800;
    }
`
const HeadingContainer = styled(Container)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 15px;
`

const HeadingBackground = styled(Card)`
    height: auto;
    width: 100%;
    padding: 20px;
    background-color: #1D1E20;
    box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
`

const BigHeading = styled.h1`
    font-size: 280%;
    font-weight: 800;
    color:  #fbdb37;
    
`
const LittleHeading = styled.h2`
    font-size: 200%;
    font-weight: 600;
    color: #fbfbfb;
    
`
const HeaderGrid = styled(Container)`
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: repeat(3, minmax(auto, auto));;
    border-radius: 25px;
    
`


const Vaults = () => {
    const [nftContract, setNftContract] = useState('');
    const [userNFTData, setUserNFTData] = useState('');
    const [userTradeData, setUserTradeData] = useState('')
    const [transacting, setTransacting] = useState(false);
   
    const {active, account, library, connector} = useWeb3React();

    const getNFTs = async (userAddress) => {
        const data = await axios.get(`https://cornoracleapi.herokuapp.com/stoploss/nfts/${userAddress}`)
        console.log("data from function")
        console.log(data)
        const darta = data.data
        return darta
    }

    const getUserTrades = async (nftIds) => {
        const tradePromises = nftIds.map( async (id) => {
            const resp = await axios.get(`https://cornoracleapi.herokuapp.com/stoploss/userTrades/${id}&[0]`)
            const raw = resp.data
            return raw 
        })

        const trades = await Promise.all(tradePromises)
        console.log("TRADE DATA")
        console.log(userTradeData)
        return trades
    }

    useEffect( async () => {
        if (active && account) {
    
            const NFTs = await getNFTs(account)
            setUserNFTData(NFTs)
            const trades = await getUserTrades(NFTs.nfts)
            setUserTradeData(trades)


            
        } else {
            const noData = setUserNFTData('')
            setUserTradeData('')
        }
    }, [account])



    useEffect( () => {
        if (active) {
            const nftctr = writeContract(
                active,
                library.getSigner(),
                account,
                addresses.StopLoss,
                stopLossAbi,
            )
            .then( value => {
                setNftContract(value)
    
            })
        } else {
            const noData = setNftContract('')
        }
    }, [userNFTData])




    if (userNFTData !== '') {
        const userNFTs = userNFTData.nfts //this would be live data
        const mapNFTs = userNFTs.map( (nft, index) => (

                        <>
                        <MyVaultContainer>
                            <MyVaultCard>
                                <MyVaultCardContainer style={{marginLeft: "12px", alignItems: "flex-start", justifyContent: "flex-start"}}>
                                    <HeaderGrid>
                                        <MultiplierBadge style={{margin: "0px !important", alignSelf: "end", display: "flex", flexDirection: "row", justifyContent: "space-evenly", height: "100%"}}>
                                        <FaTicketAlt style={{color: "#fbdb37", fontSize: "3.2em", alignSelf: "center"}}></FaTicketAlt>

                                            <div style={{marginBottom: "0px", marginTop: "3px", fontSize: "2.5em", alignSelf: "center", fontWeight: "600"}}>
                                                {`${nft}`}
                                            </div>
                                        </MultiplierBadge>
                                        <BigHeading style={{ alignSelf: "center", textAlign: "center", fontSize: "2.0em"}}>
                                            {`${userNFTData.strategy} Vault`}
                                        </BigHeading>

                                        <MultiplierBadge style={{margin: "0px !important", alignSelf: "end", justifyContent: "center" }}>
                                            <FaCircle style={{marginBottom: "5px", fontSize: "240%"}}/>
                                            <p style={{marginBottom: "3px", fontSize: "100%"}}>Open / Working</p>
                                        </MultiplierBadge>
                                        
                                    </HeaderGrid>

                                </MyVaultCardContainer>
                                <CardGrid>
                                    <VaultNFTCard
                                        mintData = {{nftContract, account}}
                                        id={index}
                                        nftId={nft}
                                        nftData={userNFTData}
                                        image={"/assets/images/StopLoss.svg"}
                                        title={userNFTData.strategy}
                                    />
                                    <VaultChartGrid style={{rowGap: "1.5em"}}>
                                        <DetailsCard >
                                            <Chart/>
                                        </DetailsCard>
                                        
                                        <DetailsCard>
                                            <VaultNFTFooter id={index} nftData={userTradeData[index]} />
                                        </DetailsCard>
                                    </VaultChartGrid>
                                </CardGrid>
                            </MyVaultCard>
                        </MyVaultContainer>
                        </>
                    

        
            
        ))

        return (
            <>
            <Page>
    
                <VaultsPageHeading />

                <OracleBar />

                <SoManyContainers>
                

                            {mapNFTs}
                        
                </SoManyContainers>
            </Page>
    
            </>
        )

    } else {

        return (
            <>
            <Page>
    
            <VaultsPageHeading />
    
                <MyVaultContainer>
                    <VaultGrid>
                        <MyVaultCard>
                            <CardGrid>
    
                                <VaultNFTCard/>
    
                                <Chart/>
                            
                            </CardGrid>
                        </MyVaultCard>
                
                    </VaultGrid>
                </MyVaultContainer>
                
            </Page>
    
            </>
        )
    }

    
}

export default Vaults
