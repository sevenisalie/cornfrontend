import React, {useState, useEffect} from 'react'
import {Container, Card, Button} from "react-bootstrap";
import styled from "styled-components";



import {MultiplierBadge} from "../../pools/components/Badges"
import {userMint} from "../../../utils/nft";
import {NFTFooter} from "./NFTFooter"
import {GiCorn} from "react-icons/gi"
import { HeaderButtonSecondary } from '../../../components/NavigationBar';


export const MyNFTCard = styled(Card)`
    border: none;
    margin-bottom: 100px;
    border-radius: 25px;
    height: auto;
    width: 70%;
    min-width: 312px;
    max-width: 312px;
    backdrop-filter: blur(12px) saturate(149%);
    -webkit-backdrop-filter: blur(0px) saturate(149%);
    background-color: rgba(29, 30, 32, 0.57);
    border: 1px solid rgba(255, 255, 255, 0.125);
    box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;
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
    border: 5px solid #141516;
    background: #4c4e54;
    width: 90%;
    height: auto;
    align-self: center;
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
    width: 100%;
    margin-left: 0px;
    align-content: space-between;
    justify-content: space-between;
    align-items: baseline;
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
    height: auto;
    width: auto;
    background: #fbdb37;
    border-color: #fce984;
    border-width: 3px;
    color: #FFFFE0;
    font-size: 20px;
    font-weight: 600;
   


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

const MaticImageWrapper = styled.img`
    height: auto;
    width: 20px;
    align-self: center;
    margin-bottom: 1px;
`

export const NFTCard = (props) => {

    // const [showStopModal, setShowStopModal] = useState(false)
    // const [chosenStrategy, setChosenStrategy] = useState(props.title)
    // const [masterChef, setMasterChef] = useState('')

    // useEffect(() => {
    //     if (props.state.masterChefLoading == false){
    //         setMasterChef(props.state.masterChefContract)
    //     } else {
    //         setMasterChef('')
    //     }
        
    // }, [props.state])

   


    
    // const handleStopModal = () => {
    //     setShowStopModal( prev => !prev)
    // }

    // const handleMint = async () => {
    //     userMint(
    //         props.mintData.nftContract, 
    //         props.mintData.account, 
    //         )
    // }

    return (
        <>
           <MyNFTCard>
                <MyNFTCardContainer>
                <NFTImageWrapper src={props.data.imageurl}></NFTImageWrapper>
                <NFTBrandName>Corn Finance</NFTBrandName>
                <NFTTitle>{props.data.name}</NFTTitle>
                <NFTLineBreak size="8"/>
                <PriceRow>
                    <ButtonWrapper style={{justifyContent: "flex-start"}}><HeaderButtonSecondary onClick={async () => props.mintFunction(props.contract)} >MINT</HeaderButtonSecondary></ButtonWrapper>
                    <MultiplierBadge style={{padding: "0.8em"}}>
                        <p style={{fontSize: "1.6em", fontWeight: "800", marginBottom: "0px"}}>{props.data.price} <MaticImageWrapper src={"assets/images/MATIC.png"} /> </p>
                    </MultiplierBadge>

                    <MultiplierBadge>
                    <GiCorn style={{fontSize: "3.8em"}} />
                    </MultiplierBadge>
                </PriceRow>


                <NFTFooter data={props.data} id={props.id}></NFTFooter>  
                </MyNFTCardContainer>
            </MyNFTCard> 
        </>
    )
}

export default NFTCard
