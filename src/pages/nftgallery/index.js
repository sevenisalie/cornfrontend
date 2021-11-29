
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
import { StyledDetailsButton } from "../../pages/pools/components/PoolCard"
import {HiChevronDoubleUp, HiChevronDoubleDown} from "react-icons/hi"

import {EthIcon, BitcoinIcon, DollarIcon} from "../vaults/components/CreateVault"

import {NFTFooter} from "./components/NFTFooter";
import {NFTCard} from "./components/NFTCard";
import {NFTHeading} from "./components/NFTHeading";

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
 



    if (fakeUserNFTs !== null && userNFTData !== null) {
        console.log(fakeUserNFTs)

        const mapFakeUserNFTs = fakeUserNFTs.map((nft, index) => (

            <NFTCard
                mintData = {{nftContract, account, nftURI}}
                id={index}
                image={userNFTData.image}
                title={userNFTData.description}
            ></NFTCard>
 
        ));


        
        return (
        <>
        <Page>

            <NFTHeading/>

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

            <NFTHeading/>

    
                <MyNFTContainer>
    
                    No NFTs :(
               
                </MyNFTContainer>
    
            </Page>
    
            </>
            )
    }
}
export default NFT