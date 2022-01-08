import styled from "styled-components";
import {ethers} from "ethers";
import React, {useEffect, useState} from "react";
import { Link } from 'react-router-dom'
import { useWeb3React } from "@web3-react/core";
import axios from "axios"
import { stringToFixed, userClaim, fetchPoolAllowance, setPoolAllowance, toFixed, getTokenStakeBalance, userStake} from "../../../utils/nft"

//components
import {Container, Card, Button, Image, Placeholder} from "react-bootstrap";
import {HeaderButtonSecondary} from "../../vaults/index"
import {MultiplierBadge} from "./Badges"
import DepositModal from "./DepositModal"
import UnstakeModal from "./UnstakeModal"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


//icons
import {BsArrowUpRightSquare, BsCalculatorFill} from "react-icons/bs"
import {GoVerified} from "react-icons/go"
import {FaCircle, FaRegCircle, FaRegCheckCircle} from "react-icons/fa"
import {BiCoinStack} from "react-icons/bi"
import {GiLockedChest} from "react-icons/gi"
import {RiCoinLine} from "react-icons/ri"
import {HiChevronDoubleUp, HiChevronDoubleDown} from "react-icons/hi"


const ActualPoolCard = styled.div`
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
const Divider = styled.div`
  background-color: #fbfbfb;
  height: 1px;
  margin: 0 auto 32px;
  width: 100%;
`
const StyledCardContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 0;
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
  color: #12aab5;
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

const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin: 16px 0;
  width: 100%;
  box-sizing: border-box;
`

const BalanceAndCompound = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
`

const StyledActionSpacer = styled.div`
  height: auto;
  width: 100%;
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
  
  box-shadow: 12px 12px 16px 0 rgba(0, 0, 0, 0.1), -10px -6px 12px 0 rgba(103, 107, 114, 0.1);
`
const CardFooter = ({
    projectLink,
    totalStaked,
    blocksRemaining,
    isFinished,
    blocksUntilStart,
    poolCategory,
    userStaked,
    bal
  }) => {
    const [isOpen, setIsOpen] = useState(false)
    const Icon = isOpen ? HiChevronDoubleUp : HiChevronDoubleDown
  
    const handleClick = () => setIsOpen(!isOpen)


    
    return (
      <StyledFooter isFinished={isFinished}>
        <Row>
          <StyledDetailsButton onClick={handleClick}>
            {isOpen ? 'Hide' : 'Details'} <Icon />
          </StyledDetailsButton>
        </Row>
        {isOpen && (
          <Details style={{display: "flex", flexDirection: "column", height: "100%"}}>
            <StyledDetails>

                <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <p style={{fontSize: "80%"}}>Deposit:</p>
                  <TokenLink style={{color: "#fbdb37"}} href={projectLink} target="_blank">
                    {'View project site'} <BsArrowUpRightSquare style={{marginLeft: '5px'}}/>
                </TokenLink>
                </Container>
        
            </StyledDetails>
            
            <StyledDetails>
            <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <p style={{fontSize: "80%"}}>My Balance</p>
                  <p style={{fontSize: "80%"}}>{bal}</p>
                </Container>
            </StyledDetails>

            <StyledDetails>
            <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <p style={{fontSize: "80%"}}>My Staked Amount:</p>
                  <p style={{fontSize: "80%"}}><RiCoinLine style={{marginRight: "6px"}}/>{`${userStaked}`}</p>
                </Container>
            </StyledDetails>




          </Details>
        )}
      </StyledFooter>
    )
  }


const PoolCard = (props) => {
    const [approved, setApproved] = useState(false)
    const [showDepositModal, setShowDepositModal] = useState(false)
    const [showUnstakeModal, setShowUnstakeModal] = useState(false)
    const masterChef = props.masterChef
    const signer = props.signer

    const goodToast = (msg) => {
      toast.success(`${msg}`, {
          position: toast.POSITION.BOTTOM_RIGHT
      })
  }

    const badToast = (msg) => {
      toast.warning(`${msg}`, {
          position: toast.POSITION.BOTTOM_RIGHT
      })
  }

    const handleModalOnClick = () => {
        setShowDepositModal(prev => !prev)
    }
    const handleUnstakeModalOnClick = () => {
      setShowUnstakeModal(prev => !prev)
  }

    const handleOnClick = () => {
        setApproved(!approved)
    }

    const handleClaimClick = async (pid) => {
      try {
        
        const tx = await userClaim(masterChef, pid)
        if (tx) {
          if (tx.status == 1) {
              goodToast(`Successfully Claimed Rewards... Allow for UI to Update`)

          } else {
              badToast("Claim Failed... Check Gas Settings and Try Again")
          }
      } else if (tx === undefined) {
          badToast(`Withdrawal cancelled`)
      }
        
      } catch (err) {
        console.log(err)
        badToast(`Something Went Wrong....Try Claiming Rewards Again`)
      }
    }


    const handleApproveClick = async (token) => {
      try {
        //pid, tokenAddress, masterchef, _signer
        await setPoolAllowance(token, masterChef, signer)
        goodToast(`Approved Pool...Allow the UI to Update`)
      } catch (err) {
        console.log(err)
        badToast(`Something Went Wrong... Try Approving the Pool Again`)
      }
    }
    
    if (props.pool !== undefined) {
      const poolData = props.pool
      const poolBalance = props.poolBalance
      const pid = props.pid
      const allowance = props.allowance
      const answer = allowance.approved
      const balance = props.balance
      const stakedAmount = stringToFixed(poolData.userStaked, 3)

      const APR = (props.userPoolData.USER.APY !== 0) ? toFixed(props.userPoolData.USER.APY, 2) :  <Placeholder as="p" animation="glow"><Placeholder xs={12} /></Placeholder>
      return (

        <>
    <DepositModal walletBalance={balance} pid={pid} showDepositModal={showDepositModal} setShowDepositModal={setShowDepositModal}/>
    <UnstakeModal userStaked={stakedAmount} pid={pid} showUnstakeModal={showUnstakeModal} setShowUnstakeModal={setShowUnstakeModal} />
    <ActualPoolCard>

      <div style={{ padding: '24px' }}>


          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: "wrap", alignItems: 'center', justifyContent: "space-between"}}>
            <CoinCard>
            <Image style={{ marginRight: "19px" }}src={`/assets/images/CornLogo.png`} width={64} height={64} alt={"COB"} />

            </CoinCard>
            <CardTitle >
           
           <div style={{display: "flex", flexDirection: 'column', alignContent: "center", justifyContent: "space-between", textAlign: "center", marginBottom: "12px"}}>

            {`${poolData.tokenStakeName}`} 
           </div>

           <MultiplierBadge><GoVerified style={{marginRight: "4px"}}/>
            {`${poolData.depositFee} Fees`}
           </MultiplierBadge>
           <MultiplierBadge>
             {`${poolData.multiplier}`}
           </MultiplierBadge>
            </CardTitle>
          </div>
        

            <StyledDetails>
                <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <p>TVL:</p>
                  <p><GiLockedChest style={{marginRight: "6px", color: "#fbfbfb"}}/>
                  {toFixed(poolBalance, 2)}
                  </p>
                </Container>
        
            </StyledDetails>

            <StyledDetails>
                <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <p>APR:</p>
                  <p><GiLockedChest style={{marginRight: "6px", color: "#fbfbfb"}}/>
                  {APR}
                  </p>
                </Container>
        
            </StyledDetails>
            
            <StyledDetails>
            <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <p>Earn:</p>
                  <p><BiCoinStack style={{marginRight: "6px"}}/>
                    {`${poolData.tokenEarnName}`}
                  </p>
                </Container>
            </StyledDetails>

            <StyledDetails>
            <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <p>Stake:</p>
                  <p><RiCoinLine style={{marginRight: "6px"}}/>{`${poolData.tokenStakeName}`}</p>
                </Container>
            </StyledDetails>

            <StyledDetails>
            <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <Container style={{ margin: "3px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <p style={{fontSize: "60%", fontWeight: "800"}}>
                          {`COB Earned:`}
                          </p>
                      <p style={{color: "#fbdb37", fontSize: "110%", fontWeight: "600"}}>
                          {`${toFixed(poolData.pendingCob, 3)}`}
                        </p>
                  </Container>
                  <ClaimButton onClick={async () => handleClaimClick(pid)}>
                        {`Claim`}
                    </ClaimButton>
                </Container>
            </StyledDetails>

            <Label  text={'COB earned'}/>
            <StyledCardActions>
  

            <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>

                {answer ? (
                <>
                    <StakeButton onClick={handleModalOnClick}>
                        {`Stake`}
                    </StakeButton>
                    <UnstakeButton onClick={handleUnstakeModalOnClick}>
                        {`Unstake`}
                    </UnstakeButton>
                </>
                ) : (
                <ApproveButton onClick={async () => handleApproveClick(poolData.tokenStakeAddress)}>
                    {`Approve Contract`}
                </ApproveButton>
                )}


                {answer ? (
                    <MultiplierBadge style={{margin: "0px !important", alignSelf: "end", }}>

                            <FaCircle style={{marginBottom: "5px", fontSize: "240%"}}/>
                            <p style={{marginBottom: "3px", fontSize: "70%"}}>Approved</p>
                    </MultiplierBadge>
                ) : (
                    <MultiplierBadge style={{padding: "6px", margin: "0px !important", alignSelf: "end", }}>
                        <FaRegCircle style={{marginBottom: "0px", fontSize: "300%"}}/>
                        
                    </MultiplierBadge>
                )}

           
            </Container>

           
    
            </StyledCardActions>

      </div>


      <CardFooter
        projectLink={"#"}
        totalStaked={`${toFixed(poolBalance, 2)}`}
        bal={balance}
        userStaked={stakedAmount}
        blocksRemaining={"10340233"}
        isFinished={false}
        blocksUntilStart={"0"}
        poolCategory={""}
        />
        </ActualPoolCard> 
            
            
        </>
    
)
    } else {
      return (

        <>
    <DepositModal showDepositModal={showDepositModal} setShowDepositModal={setShowDepositModal}/>
    <UnstakeModal showUnstakeModal={showUnstakeModal} setShowUnstakeModal={setShowUnstakeModal} />
    <ActualPoolCard>

      <div style={{ padding: '24px' }}>


          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: "wrap", alignItems: 'center', justifyContent: "space-between"}}>
            <Image style={{ marginRight: "19px" }}src={`/assets/images/CornLogo.png`} width={64} height={64} alt={"COB"} />
            <CardTitle >
           
           <div style={{display: "flex", flexDirection: 'column', alignContent: "center", justifyContent: "space-between", textAlign: "center", marginBottom: "12px"}}>

           {`COB`} (Single)
           </div>

           <MultiplierBadge><GoVerified style={{marginRight: "4px"}}/>1% Fees</MultiplierBadge>
           <MultiplierBadge>100x</MultiplierBadge>
            </CardTitle>
          </div>
        

            <StyledDetails>
                <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <p>APR:</p>
                  <p><BsCalculatorFill style={{marginRight: "6px"}}/>100</p>
                </Container>
        
            </StyledDetails>
            
            <StyledDetails>
            <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <p>Earn:</p>
                  <p><BiCoinStack style={{marginRight: "6px"}}/>COB</p>
                </Container>
            </StyledDetails>

            <StyledDetails>
            <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <p>Stake:</p>
                  <p><RiCoinLine style={{marginRight: "6px"}}/>COB</p>
                </Container>
            </StyledDetails>

            <StyledDetails>
            <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <Container style={{ margin: "3px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <p style={{fontSize: "60%", fontWeight: "800"}}>
                          {`COB Earned:`}
                          </p>
                      <p style={{color: "#fbdb37", fontSize: "110%", fontWeight: "600"}}>
                          {`43.12`}
                        </p>
                  </Container>
                  <HeaderButtonSecondary>
                        {`Claim`}
                    </HeaderButtonSecondary>
                </Container>
            </StyledDetails>

            <Label  text={'COB earned'}/>
            <StyledCardActions>
  

            <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>

                {approved ? (
                <>
                    <HeaderButtonSecondary onClick={handleModalOnClick}>
                        {`Stake`}
                    </HeaderButtonSecondary>
                    <HeaderButtonSecondary onClick={handleUnstakeModalOnClick}>
                        {`Unstake`}
                    </HeaderButtonSecondary>
                </>
                ) : (
                <HeaderButtonSecondary onClick={handleOnClick}>
                    {`Approve Contract`}
                </HeaderButtonSecondary>
                )}


                {approved ? (
                    <MultiplierBadge style={{margin: "0px !important", alignSelf: "end", }}>

                            <FaCircle style={{marginBottom: "5px", fontSize: "240%"}}/>
                            <p style={{marginBottom: "3px", fontSize: "70%"}}>Approved</p>
                    </MultiplierBadge>
                ) : (
                    <MultiplierBadge style={{padding: "6px", margin: "0px !important", alignSelf: "end", }}>
                        <FaRegCircle style={{marginBottom: "0px", fontSize: "300%"}}/>
                        
                    </MultiplierBadge>
                )}

           
            </Container>

           
    
            </StyledCardActions>

      </div>


      <CardFooter
        projectLink={"#"}
        totalStaked={"323.34"}
        blocksRemaining={"10340233"}
        isFinished={false}
        blocksUntilStart={"0"}
        poolCategory={""}
        />
        </ActualPoolCard> 
            
            
        </>
    
)
    }
    
}

export default PoolCard
