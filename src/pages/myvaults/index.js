
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

const MyVaultCard = styled(Card)`
    padding: 5px;
    border-radius: 8px;
    height: auto;
    width: 100%;
    background-color: #1D1E20;
    box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
`
const MyVaultCardContainer = styled(Container)`
    display: flex;
    flex-direction: row;
    flex-wrap: no-wrap;
    align-items: baseline;
    align-content: space-around;
    justify-content: space-around;
    gap: 8px;
`
const PriceTargetRow = styled(Container)`
    display: flex;
    flex-direction: column;
    padding: 0px;
    width: auto;
    margin: 0px;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 2px;
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
    
    const getNFTData = async () => {
        const response = await axios.get('https://jsonplaceholder.typicode.com/todos/1')
        return response
    }

 
    console.log(userNFTData)
    return (
        <>
        <Page>

            <HeadingContainer>
                <HeadingBackground>
                    <BigHeading>Vault Dashboard</BigHeading>
                    <LittleHeading>Keep Track of Your Open Vaults and Strategies</LittleHeading>
                    <MintButton onClick={async () => handleMint()}>Mint Now</MintButton>
                </HeadingBackground>
            </HeadingContainer>

            <MyVaultContainer>
                <MyVaultRow>

                    <MyVaultCard>
                        <MyVaultCardContainer>
                        <PriceTargetRow>
                            <h2> ETH/USDC </h2>
                            <h2><EthIcon /></h2>
                        </PriceTargetRow>

                        <PriceTargetRow>
                            <h2> Status</h2>
                            <h2>Open</h2>
                        </PriceTargetRow>
                        <PriceTargetRow>
                            <h2> Strat</h2>
                            <h2>5% Bracket</h2>
                        </PriceTargetRow>

                        <PriceTargetRow>
                            <p>entry price: 4587.48</p>
                            <p>max profit target: 4786.14</p>
                            <p>entry amount: 120.0</p>
                        </PriceTargetRow>
                        
                        </MyVaultCardContainer>
                    </MyVaultCard>
                    <MyVaultCard>
                        <h2>Shabat</h2>
                    </MyVaultCard>
                    <MyVaultCard>
                        <h2>Ketuviim</h2>
                    </MyVaultCard>
                </MyVaultRow>
            </MyVaultContainer>

        </Page>

        </>
    )
}

export default Vaults
