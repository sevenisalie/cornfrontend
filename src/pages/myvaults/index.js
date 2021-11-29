
import styled from "styled-components";
import {Page} from "../../components/Page"
import {ethers} from "ethers";
import React, {useEffect, useState} from "react";
import { useWeb3React } from "@web3-react/core";
import { addresses } from "../../config/addresses";
import { nftURI } from "../../config/uri";

import axios from "axios"
import {nftABI} from "../../config/abis";
import {Container, Card, Button} from "react-bootstrap";
import {writeContract, userMint} from "../../utils/nft";
import {VaultNFTCard} from "./components/VaultNFTCard";
import {VaultNFTFooter} from "./components/VaultNFTFooter";
import {Chart} from "./components/Chart";

import {EthIcon, BitcoinIcon, DollarIcon} from "../vaults/components/CreateVault"

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
    border-radius: 8px;
    position: relative;
    z-index: 0;
    height: auto;
    width: 100%;
    background-color: #1D1E20;
    box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
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
    flex-direction: column;
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
const HorizontalLine = styled.hr`
    width: 100%;
    color: #fbfbfb;
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


const Vaults = () => {
    const [nftContract, setNftContract] = useState('');
    const [userNFTData, setUserNFTData] = useState('');
    const [transacting, setTransacting] = useState(false);
   
    const {active, account, library, connector} = useWeb3React();

    useEffect( () => {
        if (active) {
            const nftctr = writeContract(
                active,
                library.getSigner(),
                account,
                addresses.nft,
                nftABI,
            )
            .then( value => {
                setNftContract(value)
                console.log(value.address)
            })
        } else {
            const noData = setNftContract('')
        }
    }, [account])

    useEffect( () => {
        if (active) {
    
            axios.get(nftURI)
            .then(response => setUserNFTData(response.data))
            
        } else {
            const noData = setUserNFTData('')
        }
    }, [nftContract])

    const fakeUserNFTs = [ 
        "0xisdhfwouhfihfihsdkfjhaskdjfhasjkdf",
        "0xisdhfwouhfihfihsdkfjhaskdjfhasjkdf",

    ] //this would be live data

    if (fakeUserNFTs !== null && userNFTData !== null) {

        const mapFakeNFTs = fakeUserNFTs.map( (nft, index) => (

                        <>
                        <MyVaultContainer>
                            <MyVaultCard>
                                <CardGrid>
                                    <VaultNFTCard
                                        mintData = {{nftContract, account, nftURI}}
                                        id={index}
                                        image={userNFTData.image}
                                        title={userNFTData.description}
                                    />
                                    <VaultChartGrid>
                                        <Chart/>
                                        <VaultNFTFooter id={index} />
                                    </VaultChartGrid>
                                </CardGrid>
                            </MyVaultCard>
                        </MyVaultContainer>
                        </>
                    

        
            
        ))

        return (
            <>
            <Page>
    
                <HeadingContainer>
                    <HeadingBackground>
                        <BigHeading>Vault Dashboard</BigHeading>
                        <LittleHeading>Keep Track of Your Open Vaults and Strategies</LittleHeading>
                    </HeadingBackground>
                </HeadingContainer>

                <SoManyContainers>
                

                            {mapFakeNFTs}
                        
                </SoManyContainers>
            </Page>
    
            </>
        )

    } else {

        return (
            <>
            <Page>
    
                <HeadingContainer>
                    <HeadingBackground>
                        <BigHeading>Vault Dashboard</BigHeading>
                        <LittleHeading>Keep Track of Your Open Vaults and Strategies</LittleHeading>
                    </HeadingBackground>
                </HeadingContainer>
    
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
