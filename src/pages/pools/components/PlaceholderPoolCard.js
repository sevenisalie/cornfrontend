import styled from "styled-components";
import {ethers} from "ethers";
import React, {useEffect, useState} from "react";
import { Link } from 'react-router-dom'
import { useWeb3React } from "@web3-react/core";

import {POOLS} from "../../../config/pools";


import {Container, Card, Button, Image, Placeholder, Spinner} from "react-bootstrap";
import {HeaderButtonSecondary} from "../../vaults/index"
import {MultiplierBadge} from "./Badges"
import DepositModal from "./DepositModal"
import UnstakeModal from "./UnstakeModal"
import LoadingSpinner from "./LoadingSpinner"
import CardFooter from "./CardFooter"

import {GoVerified} from "react-icons/go"
import {FaCircle, FaRegCircle, FaRegCheckCircle} from "react-icons/fa"
import {BiCoinStack} from "react-icons/bi"
import {GiLockedChest} from "react-icons/gi"
import {RiCoinLine} from "react-icons/ri"

const ActualPoolCard = styled.div`
    max-width: 375px;
    min-width: 374px;
    border-radius: 50px;
    backdrop-filter: blur(12px) saturate(149%);
    -webkit-backdrop-filter: blur(0px) saturate(149%);
    background-color: rgba(29, 30, 32, 0.57);
    border: 1px solid rgba(255, 255, 255, 0.125);
    display: flex;
    flex-direction: column;
    position: relative;
    box-shadow: 20px 20px 30px rgba(0, 0, 0, 0.5)

`
const CardTitle = styled.div`
  font-weight: 600;
  font-size: 24px;
  line-height: 1.1;
  margin-bottom: 14px;
`
const ClaimButton = styled(HeaderButtonSecondary)`
`

const ApproveButton = styled(HeaderButtonSecondary)`
`

const StakeButton = styled(HeaderButtonSecondary)`
`

const UnstakeButton = styled(HeaderButtonSecondary)`
`

export const StyledDetailsButton = styled.button`
  align-items: center;
  background-color: transparent;
  border: 0;
  color: #fbdb37;
  cursor: pointer;
  display: inline-flex;
  font-size: 16px;
  font-weight: 600;
  height: 32px;
  justify-content: center;
  outline: 0;
  padding: 0;
  &:hover {
    opacity: 0.9;
  }
  & > svg {
    margin-left: 4px;
  }
`

const Label = styled.div`
  font-size: 14px;
`


const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin: 16px 0;
  width: 100%;
  box-sizing: border-box;
`

const StyledDetails = styled.div`
  display: flex;
  font-size: 120%;
  font-weight: 600;
  color: #fbfbfb;
`
const CoinCard = styled(Card)`
  border: none;
  width: 64px;
  height: 64px;
  border-radius: 100%;
  background-color: transparent;
  
  box-shadow: 12px 9px 39px -1px rgba(0,0,0,0.54);
-webkit-box-shadow: 12px 9px 39px -1px rgba(0,0,0,0.54);
-moz-box-shadow: 12px 9px 39px -1px rgba(0,0,0,0.54);
`

const PlaceholderPoolCard = (props) => {
    return (
        <>
    <ActualPoolCard>

          <div style={{ padding: '24px' }}>


              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: "wrap", alignItems: 'center', justifyContent: "space-between"}}>
              
               
                  
                <LoadingSpinner />
                  
                  
        
                <CardTitle >
              
              <div style={{display: "flex", flexDirection: 'column', alignContent: "center", justifyContent: "space-between", textAlign: "center", marginBottom: "12px"}}>
              <p>
              {props.tokenStake} 
              <Image style={{ marginLeft: "0.3em", marginRight: "0.5em" }}src={`${props.data.imageurl}`} width={49} height={49} alt={"COB"} />

              </p>
                

              </div>

              
              

              <Placeholder as="p" animation="glow">
                    <Placeholder lg={12} />
                </Placeholder>
                </CardTitle>
              </div>
            

                <StyledDetails>
                    <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                      <p>TVL:</p>
                      <Placeholder style={{width: "3.5em", height: "auto"}} as="p" animation="glow">
                            <Placeholder lg={12} />
                        </Placeholder>
                     
                    </Container>

                </StyledDetails>

                <StyledDetails>
                    <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                      <p>APR:</p>
                      <Placeholder style={{width: "3.5em"}} as="p" animation="glow" >
                            <Placeholder lg={12} />
                        </Placeholder>
                    </Container>
            
                </StyledDetails>
                
                <StyledDetails>
                <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                      <p>Earn:</p>
                      <p><BiCoinStack style={{marginRight: "6px"}}/>
                        COB
                      </p>
                    </Container>
                </StyledDetails>

                <StyledDetails>
                <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                      <p>Stake:</p>
                      <p><RiCoinLine style={{marginRight: "6px"}}/>
                      {props.tokenStake}
                      </p>
                    </Container>
                </StyledDetails>

                <StyledDetails>
                <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                      <Container style={{ margin: "3px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                          <p style={{fontSize: "60%", fontWeight: "800"}}>
                              {`COB Earned:`}
                              </p>
                          <Placeholder as="p" animation="glow" >
                            <Placeholder lg={12} />
                        </Placeholder>
                      </Container>
                      <ClaimButton >
                            {`Claim`}
                        </ClaimButton>
                    </Container>
                </StyledDetails>

                <Label  text={'COB earned'}/>
                <StyledCardActions>
      

                <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>

                
                    <ApproveButton>
                        {`Paused`}
                    </ApproveButton>
              


                    
                 
                        <Placeholder style={{width: "3.5em", height: "auto"}} as="h2" animation="glow">
                            <Placeholder lg={12} />
                        </Placeholder>
            
                   
              

              
                </Container>

              
        
                </StyledCardActions>

          </div>

          
        </ActualPoolCard>         
        </>
    )
}

export default PlaceholderPoolCard
