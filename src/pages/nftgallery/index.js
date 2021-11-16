
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

import {EthIcon, BitcoinIcon, DollarIcon} from "../vaults/components/CreateVault"
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
    grid-template-columns: auto auto;
    grid-template-rows: auto;
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


const MyNFTCard = styled(Card)`
    border-radius: 8px;
    height: auto;
    width: auto;
    background-color: #1D1E20;
    box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
`
const MyNFTCardContainer = styled(Container)`
    display: flex;
    flex-direction: column;
    padding: 12px;
    align-items: flex-start;
    align-content: flex-start;
    justify-content: space-around;
    gap: 8px;

    @media (max-width: 768px) {
        flex-direction: column;
      }
`
const NFTImageWrapper = styled.img`
    border-radius: 5px;
`
const NFTBrandName = styled.p`
    font-size: 70%;
    color: #fbdb37;
`
const NFTTitle = styled.h3`
    font-size: 120%;
    font-weight: 600;
    color: #fbfbfb;
`
const NFTLineBreak = styled.hr`
      color: #393C3F;
      width: 100%;
`
const PriceRow = styled(Container)`
    display: flex;
    flex-direction: row;
    padding: 0px;
    width: 100%;
    margin: 0px;
    align-content: space-between;
    justify-content: space-between;
    gap: 12px;
`

const ButtonWrapper = styled.div`
      display: flex;
      flex-direction: row;
      width: 40%;
      height: auto;
`

const MintButton = styled(Button)`
    border-radius: 15px;
    height: 50px;
    width: auto;
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

const NFT = () => {
    const [nftContract, setNftContract] = useState('');
    const [userNFTData, setUserNFTData] = useState('');
    const {active, account, library, connector} = useWeb3React();
    const [transacting, setTransacting] = useState(false);

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

    const handleMint = async () => {
        setTransacting(true)
        userMint(nftContract, account, nftURI)
        setTransacting(false)
    }
    

    const fakeUserNFTs = [ 
        "0xisdhfwouhfihfihsdkfjhaskdjfhasjkdf",
        "0xisdhfwouhfihfihsdkfjhaskdjfhasjkdf",
        "0xisdhfwouhfihfihsdkfjhaskdjfhasjkdf",
        "0xisdhfwouhfihfihsdkfjhaskdjfhasjkdf",
    ]
 
    console.log(userNFTData)

    if (fakeUserNFTs !== null && userNFTData !== null) {
        console.log(fakeUserNFTs)
        const mapFakeUserNFTs =  fakeUserNFTs.map((nft) => (
            <MyNFTCard>
                <MyNFTCardContainer>
                <NFTImageWrapper src={userNFTData.image}></NFTImageWrapper>
                <NFTBrandName>HelloFrontier</NFTBrandName>
                <NFTTitle>{userNFTData.description}</NFTTitle>
                <NFTLineBreak size="8"/>
                <PriceRow>
                    <NFTBrandName>Asking Price</NFTBrandName>
                    <NFTTitle><EthIcon />100.00</NFTTitle>
                </PriceRow>
                </MyNFTCardContainer>
            </MyNFTCard>
        ));

        return (
        <>
        <Page>

            <HeadingContainer>
                <HeadingBackground>
                    <BigHeading>Strategy Marketplace</BigHeading>
                    <LittleHeading>Acquire new strategies by minting an NFT to suit your trading style</LittleHeading>
                    <ButtonWrapper><MintButton onClick={async () => handleMint()}>Mint Now</MintButton></ButtonWrapper>
                </HeadingBackground>
            </HeadingContainer>

            <MyNFTGrid>

                {mapFakeUserNFTs}
           
            </MyNFTGrid>

        </Page>

        </>
        )
    } else {
        return (
            <>
            <Page>
    
                <HeadingContainer>
                    <HeadingBackground>
                        <BigHeading>Strategy Marketplace</BigHeading>
                        <LittleHeading>Acquire new strategies by minting an NFT to suit your trading style</LittleHeading>
                        <ButtonWrapper><MintButton onClick={async () => handleMint()}>Mint Now</MintButton></ButtonWrapper>
                    </HeadingBackground>
                </HeadingContainer>
    
                <MyNFTContainer>
    
                    No NFTs :(
               
                </MyNFTContainer>
    
            </Page>
    
            </>
            )
    }
}
export default NFT