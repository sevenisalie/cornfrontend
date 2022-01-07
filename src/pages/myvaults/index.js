import LIMITABI from "../../config/contracts/LimitOrderVault.json"
import STOPABI from "../../config/contracts/StopLossVault.json"
import ACCDISTABI from "../../config/contracts/AccumulatorDistributorVault.json"
import styled from "styled-components";
import {Page} from "../../components/Page"
import {ethers} from "ethers";
import React, {useEffect, useState} from "react";
import { useWeb3React } from "@web3-react/core";
import { addresses } from "../../config/addresses";
import { nftURI } from "../../config/uri";
import BackdropFilter from "react-backdrop-filter";
//abis

import axios from "axios"
import {nftABI, stopLossAbi} from "../../config/abis";
import {Container, Card, Button} from "react-bootstrap";
import {writeContract, userMint} from "../../utils/nft";
import {VaultNFTCard} from "./components/VaultNFTCard";
import VaultsPageHeading from "./components/VaultsPageHeading"
import {OracleBar} from "../../components/OracleBar";
import {VaultNFTFooter} from "./components/VaultNFTFooter";
import VaultSelector from "./components/VaultSelector"
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
    
    backdrop-filter: blur(12px) saturate(149%);
    -webkit-backdrop-filter: blur(0px) saturate(149%);
    background-color: rgba(29, 30, 32, 0.57);
    border: 1px solid rgba(255, 255, 255, 0.125);
    box-shadow: 12px 12px 16px 0 rgba(0, 0, 0, 0.3);
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
const StyledBackDrop = styled(Card)`
    width: 40%;
    display: flex;
    margin-top: 40px;
    padding-top: 6px;
    justify-content: center;
    align-self: center;
    align-content: center;
    border-radius: 50px;
    backdrop-filter: blur(12px) saturate(149%);
    -webkit-backdrop-filter: blur(0px) saturate(149%);
    background-color: rgba(29, 30, 32, 0.57);
    border: 1px solid rgba(255, 255, 255, 0.125);
    box-shadow: 6px 6px 8px 0 rgba(0, 0, 0, 0.3);
    
`

const UserVaults = (props) => {
    

    if (props.userVaultData !== undefined) {
       
        console.log("State Vaults")
        console.log(props.userVaultData)
        
        const mapNFTs = props.userVaultData.map( (nft, index) => (
            
            
                        <>
                        <MyVaultContainer>
                            <MyVaultCard>
                                <MyVaultCardContainer style={{marginLeft: "12px", alignItems: "flex-start", justifyContent: "flex-start"}}>
                                    <HeaderGrid>
                                        <MultiplierBadge style={{margin: "0px !important", alignSelf: "end", display: "flex", flexDirection: "row", justifyContent: "space-evenly", height: "100%"}}>
                                        <FaTicketAlt style={{color: "#fbdb37", fontSize: "3.2em", alignSelf: "center"}}></FaTicketAlt>
    
                                            <div style={{marginBottom: "0px", marginTop: "3px", fontSize: "2.5em", alignSelf: "center", fontWeight: "600"}}>
                                                {`Vault ID`}
                                            </div>
                                        </MultiplierBadge>
                                        <BigHeading style={{ alignSelf: "center", textAlign: "center", fontSize: "2.0em"}}>
                                            {`NAME Vault`}
                                        </BigHeading>
    
                                        <MultiplierBadge style={{margin: "0px !important", alignSelf: "end", justifyContent: "center" }}>
                                            <FaCircle style={{marginBottom: "5px", fontSize: "240%"}}/>
                                            <p style={{marginBottom: "3px", fontSize: "100%"}}>Open / Working</p>
                                        </MultiplierBadge>
                                        
                                    </HeaderGrid>
    
                                </MyVaultCardContainer>
                                <CardGrid>
                                    {/* <VaultNFTCard    ///fix when data good
                                        id={nft.tokenId}
                                        vaultData={nft}
                                        image={"/assets/images/StopLoss.svg"}
                                    /> */}
                                    <VaultChartGrid style={{rowGap: "1.5em"}}>
                                        <DetailsCard >
                                            <Chart/>
                                        </DetailsCard>
                                        
                                        <DetailsCard>
                                            <VaultNFTFooter />
                                        </DetailsCard>
                                    </VaultChartGrid>
                                </CardGrid>
                            </MyVaultCard>
                        </MyVaultContainer>
                        </>
                    
    
        
            
        ))
        return (
            <>
            <SoManyContainers>
                
    
                {mapNFTs}
            
            </SoManyContainers>
            </>
        )
    } else {
        return (
            <>
        
        
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
                
         
    
            </>
        )
    }
    
}

const Vaults = () => {
    const [userVaultData, setUserVaultData] = useState(undefined);
    const [userVaultIds, setUserVaultIds] = useState(null)
    const [transacting, setTransacting] = useState(false);
    const [vaultMode, setVaultMode] = useState(null)
    const [userTradeData, setUserTradeData] = useState(null)
    const {active, account, library, connector} = useWeb3React();

    const VAULTSWITCH = [
        { 
            name: "limit",
            address: addresses.vaults.limitVault,
            abi: LIMITABI.abi
        },
        { 
            name: "stop",
            address: addresses.vaults.stopVault,
            abi: STOPABI.abi
        },
        { 
            name: "accumulatordistributor",
            address: addresses.vaults.accDistVault,
            abi: ACCDISTABI.abi
        },
    ]


    //VAULTS

    const getVaults = async (userAddress, _vaultMode) => {
        const resp = await axios.get(`https://cornoracleapi.herokuapp.com/${VAULTSWITCH[_vaultMode].name}/vaults/${userAddress}`)

        const raw = resp.data
        
        return raw
    }

    

    useEffect( async () => {
        
        
            try {
            const Vaults = await getVaults(account, vaultMode)
            setUserVaultData(Vaults)
            console.log("Vaults Raw")
            console.log(Vaults)
           
            
            const vaultIds = Vaults.map( (data) => {
                return data.id
            })

            setUserVaultIds(vaultIds)

        } catch (err) {console.log(err)}
            
    }, [])


    //TRADES

    const getUserTrades = async (nftIds, _vaultMode) => {
        
        const tradePromises = nftIds.map( async (id) => {
            const resp = await axios.get(`https://cornoracleapi.herokuapp.com/${VAULTSWITCH[_vaultMode].name}/trades/${id}`)
            const raw = resp.data
            
            
            return raw 
        })
    
        const trades = await Promise.all(tradePromises)

        return trades
        
    }


    useEffect( async () => {
        try {
            const Trades = await getUserTrades(userVaultIds, vaultMode)
            setUserTradeData(Trades)
        } catch (err) {console.log(err)}
    }, [])
    

    


        return (
            <>
            <Page>
    
                <VaultsPageHeading />

                <OracleBar />

                <VaultSelector setVaultMode={setVaultMode}/>

                { vaultMode ==null &&
                <StyledBackDrop filter={"blur(5px)"}>
                <h2 style={{color: "#fbdb37", opacity: "60%", fontWeight: "600", alignSelf: "center"}}>
                    Select Order Type...
                </h2>

                </StyledBackDrop>
                }

                
                <UserVaults userVaultData={userVaultData}/>
                
                                
        
            </Page>
    
            </>
        )

    
}

export default Vaults
