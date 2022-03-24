import styled from "styled-components";
import {ethers} from "ethers";
import React, {useEffect, useState} from "react";
import { Link } from 'react-router-dom'
import { useWeb3React } from "@web3-react/core";
import {MasterChefABI, ERC20Abi} from "../../../config/abis";
import {getUserTokenBalance} from "../../../utils/fetchUserData"
import { stringToFixed, userClaim, fetchPoolAllowance, setPoolAllowance, toFixed, getTokenStakeBalance, userStake} from "../../../utils/nft"



import {BsArrowUpRightSquare, BsCalculatorFill} from "react-icons/bs"
import {HiChevronDoubleUp, HiChevronDoubleDown} from "react-icons/hi"
import {RiCoinLine} from "react-icons/ri"

import {Container, Card, Button, Image, Placeholder, Spinner} from "react-bootstrap";



const StyledButton = styled.button`
  align-items: center;
  background: #fbdb37;
  border: 0;
  border-radius: 12px;
  color: #32cad7;
  cursor: pointer;
  display: flex;
  font-size: 100%;
  font-weight: 700;
  height: auto;
  justify-content: center;
  outline: none;
  padding-left: 5px;
  padding-right: 5px;
  width: 100%;
  border: 2px solid #33cbd7;
  font-size: 14px;
  padding: 4px;
`

const StyledLink = styled(Link)`
  align-items: center;
  color: inherit;
  display: flex;
  flex: 1;
  height: 56px;
  justify-content: center;
  margin: 0 2px;
  padding: 0 4px;
  text-decoration: none;
`

const StyledExternalLink = styled.a`
  align-items: center;
  color: inherit;
  display: flex;
  flex: 1;
  height: 56px;
  justify-content: center;
  margin: 0 4px;
  padding: 0 4px;
  text-decoration: none;
`

//footer expandable

const StyledDetails = styled.div`
  display: flex;
  font-size: 120%;
  font-weight: 600;
  color: #fbfbfb;
`

const StyledFooter = styled.div`
  border-top: 1px solid grey;
  padding: 24px;
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
const Details = styled.div`
  margin-top: 24px;
`

const Row = styled.div`
  align-items: center;
  display: flex;
`

const FlexFull = styled.div`
  flex: 1;
`
const Label = styled.div`
  font-size: 14px;
`
const TokenLink = styled.a`
  font-size: 14px;
  text-decoration: none;

`

const PoolFinishedSash = styled.div`
  background-position: top right;
  background-repeat: not-repeat;
  height: 135px;
  position: absolute;
  right: -24px;
  top: -24px;
  width: 135px;
`


const CardFooter = (props, {
    isFinished,
  }) => {
    const {active, account, library, connector} = useWeb3React();
    const [balance, setBalance] = useState('')
    const Icon = props.isOpen ? HiChevronDoubleUp : HiChevronDoubleDown
  
    const handleClick = () => props.setIsOpen()


    

    
    return (
      <StyledFooter isOpen={props.isOpen} isFinished={isFinished}>
        <Row>
          <StyledDetailsButton onClick={handleClick}>
            {props.isOpen ? 'Hide' : 'Details'} <Icon />
          </StyledDetailsButton>
        </Row>
        {props.isOpen && (
          <Details style={{display: "flex", flexDirection: "column", height: "100%"}}>
            <StyledDetails>

                <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <p style={{fontSize: "80%"}}>Purchase:</p>
                  <TokenLink style={{color: "#fbdb37"}} href={props.projectLink} target="_blank" >
                    {'View project site'} <BsArrowUpRightSquare style={{marginLeft: '5px'}}/>
                </TokenLink>
                </Container>
        
            </StyledDetails>
            
            <StyledDetails>
            <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <p style={{fontSize: "80%"}}>Pool TVL:</p>
                  <p style={{fontSize: "80%"}}><RiCoinLine style={{marginRight: "6px"}}/>{toFixed(props.data.APY.poolTVL, 2)}</p>
                </Container>
            </StyledDetails>

            <StyledDetails>
            <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <p style={{fontSize: "80%"}}>Staked:</p>
                  <p style={{fontSize: "80%"}}><RiCoinLine style={{marginRight: "6px"}}/>{`${toFixed(props.data.USER.stakedAmount, 6)}`}</p>
                </Container>
            </StyledDetails>




          </Details>
        )}
      </StyledFooter>
    )
  }

  export default CardFooter
