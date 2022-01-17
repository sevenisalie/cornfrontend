import styled from "styled-components";
import {ethers} from "ethers";
import React, {useEffect, useState} from "react";
import { Link } from 'react-router-dom'
import { useWeb3React } from "@web3-react/core";
import axios from "axios"

import {POOLS} from "../../../config/pools";
import {useRefresh} from "../../../utils/useRefresh";
import { stringToFixed, userClaim, fetchPoolAllowance, setPoolAllowance, toFixed, getTokenStakeBalance, userStake} from "../../../utils/nft"
import { fetchPendingCob } from "../../../utils/fetchUserData"

//components
import {Container, Card, Button, Image, Placeholder, Spinner} from "react-bootstrap";
import {HeaderButtonSecondary} from "../../vaults/index"
import {MultiplierBadge} from "./Badges"
import DepositModal from "./DepositModal"
import UnstakeModal from "./UnstakeModal"
import LoadingSpinner from "./LoadingSpinner"
import CardFooter from "./CardFooter"
import PlaceholderPoolCard from "./PlaceholderPoolCard"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


//icons
import {GoVerified} from "react-icons/go"
import {FaCircle, FaRegCircle, FaRegCheckCircle} from "react-icons/fa"
import {BiCoinStack} from "react-icons/bi"
import {GiLockedChest} from "react-icons/gi"
import {RiCoinLine} from "react-icons/ri"


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
  backdrop-filter: blur(12px) saturate(149%);
  -webkit-backdrop-filter: blur(0px) saturate(149%);
  background-color: rgba(29, 30, 32, 0.57);
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  box-shadow: 12px 9px 39px -1px rgba(0,0,0,0.54);
  -webkit-box-shadow: 12px 9px 39px -1px rgba(0,0,0,0.54);
  -moz-box-shadow: 12px 9px 39px -1px rgba(0,0,0,0.54);
`



const PoolCard = (props, {state}) => {
    const [approved, setApproved] = useState(false)
    const {active, account, library, connector} = useWeb3React();
    const { fastRefresh } = useRefresh()
    const [showDepositModal, setShowDepositModal] = useState(false)
    const [showUnstakeModal, setShowUnstakeModal] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const [poolLoading, setPoolLoading] = useState(true)
    const [masterChef, setMasterChef] = useState('')
    const [poolState, setPoolState] = useState('')
    const [poolData, setPoolData] = useState('')
    const [allowance, setAllowance] = useState(false)
    const [pendingCob, setPendingCob] = useState('')
    

    // catch previous reduced state
  useEffect(() => {
    if (props.state.userPoolDataLoading == false){
        setLoadingData(false)
    } else {
        setLoadingData(true)
    }
      
  }, [props.state.userPoolDataLoading])

  useEffect(() => {
    if (props.state.poolDataLoading == false){
        setPoolLoading(false)
    } else {
        setPoolLoading(true)
    }
      
  }, [props.state.userPoolDataLoading])

  useEffect( () => {
    if (props.state.poolData[props.pid] !== undefined) {
      setPoolData(props.state.poolData[props.pid])
    }
  }, [props.state.poolData])

  useEffect(() => {
    if (props.state.masterChefLoading == false){
        setMasterChef(props.state.masterChefContract)
    } else {
        setMasterChef('')
    }
      
  }, [props.state.masterChefLoading])

  useEffect(() => {
    if (props.state.userPoolData[props.pid] == undefined){
        setPoolState('')
    } else {
        setPoolState(props.state.userPoolData[props.pid])

        const poolData = props.state.userPoolData[props.pid]
        setAllowance(poolData.USER.allowance)
        
    }
    
  }, [props.state.userPoolData])

  useEffect( async () => {
    if (account && masterChef) {
      try {
        const pendingCob = await fetchPendingCob(POOLS, masterChef, account)
        setPendingCob(pendingCob[props.pid])
      } catch (err) {
        console.log(err)
      }
      
    }
  }, [account, masterChef, fastRefresh])


  //toasties
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

  //clickies
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
        await setPoolAllowance(token, props.state.masterChefContract, props.state.signer)
        goodToast(`Approved Pool...Allow the UI to Update`)
      } catch (err) {
        console.log(err)
        badToast(`Something Went Wrong... Try Approving the Pool Again`)
      }
    }
    






  if (loadingData == false) {
      
      return (

        <>
        <DepositModal walletBalance={3434} pid={1} showDepositModal={showDepositModal} setShowDepositModal={setShowDepositModal}/>
        <UnstakeModal userStaked={32443} pid={1} showUnstakeModal={showUnstakeModal} setShowUnstakeModal={setShowUnstakeModal} />

        <ActualPoolCard>

          <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: "wrap", alignItems: 'center', justifyContent: "space-between"}}>
                <CoinCard>
                  {poolLoading == true
                  ?
                  <LoadingSpinner />
                  :
                  <Image style={{ marginRight: "19px" }}src={`/assets/images/CornLogo.png`} width={64} height={64} alt={"COB"} />
                  }
                </CoinCard>
                <CardTitle >
              
                  <div style={{display: "flex", flexDirection: 'column', alignContent: "center", justifyContent: "space-between", textAlign: "center", marginBottom: "12px"}}>

                    {poolState.LP ? poolState.LP.token0.token + '-' + poolState.LP.token1.token : poolState.Token.symbol} 
                  </div>

                  <MultiplierBadge><GoVerified style={{marginRight: "4px"}}/>
                  {poolLoading == false ? toFixed(poolData.DepositFeePercent, 1) : null}
                  {`% Fees`}
                  </MultiplierBadge>

                  <MultiplierBadge>
                  {'1x'}
                  </MultiplierBadge>

                </CardTitle>
              </div>
            

                <StyledDetails>
                    <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                      <p>TVL:</p>
                      <p><GiLockedChest style={{marginRight: "6px", color: "#fbfbfb"}}/>
                      {toFixed(poolState.USER.poolTVL, 2)}
                      </p>
                    </Container>
            
                </StyledDetails>

                <StyledDetails>
                    <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                      <p>APR:</p>
                      <p><GiLockedChest style={{marginRight: "6px", color: "#fbfbfb"}}/>
                      {toFixed(poolState.USER.APY, 2)}
                      </p>
                    </Container>
            
                </StyledDetails>
                
                <StyledDetails>
                <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                      <p>Earn:</p>
                      <p><BiCoinStack style={{marginRight: "6px"}}/>
                      {poolLoading == false ? poolData.EarnToken.symbol : null}
                      </p>
                    </Container>
                </StyledDetails>

                <StyledDetails>
                <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                      <p>Stake:</p>
                      <p><RiCoinLine style={{marginRight: "6px"}}/>
                      {poolState.LP ? poolState.LP.token0.token + '-' + poolState.LP.token1.token : poolState.Token.symbol} 
                      </p>
                    </Container>
                </StyledDetails>

                <StyledDetails>
                <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                      <Container style={{ margin: "3px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                          <p style={{fontSize: "60%", fontWeight: "800"}}>
                              {`COB Earned:`}
                              </p>
                          <p style={{color: "#fbdb37", fontSize: "110%", fontWeight: "600"}}>
                              {toFixed(pendingCob, 2)}
                            </p>
                      </Container>
                      <ClaimButton onClick={async () => handleClaimClick()}>
                            {`Claim`}
                        </ClaimButton>
                    </Container>
                </StyledDetails>

                <Label  text={'COB earned'}/>
                <StyledCardActions>
      

                <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>

                    {allowance == true ? (
                    <>
                        <StakeButton onClick={handleModalOnClick}>
                            {`Stake`}
                        </StakeButton>
                        <UnstakeButton onClick={handleUnstakeModalOnClick}>
                            {`Unstake`}
                        </UnstakeButton>
                    </>
                    ) : (
                    <ApproveButton onClick={async () => handleApproveClick(poolState.tokenStakeAddress)}>
                        {`Approve Contract`}
                    </ApproveButton>
                    )}


                    {allowance == true ? (
                        <MultiplierBadge style={{margin: "0px !important", alignSelf: "end", }}>

                          {poolLoading == true 
                            ?   <Spinner animation="grow" variant="warning" /> 
                            :   
                                <>
                                <FaCircle style={{marginBottom: "5px", fontSize: "240%"}}/>
                                <p style={{marginBottom: "3px", fontSize: "70%"}}>Approved</p>
                                </>
                            }

                        </MultiplierBadge>
                    ) : (
                        <MultiplierBadge style={{padding: "6px", margin: "0px !important", alignSelf: "end", }}>
                            {poolLoading == true 
                            ?   <Spinner animation="grow" variant="warning" /> 
                            :   
                                <>
                                <FaRegCircle style={{marginBottom: "0px", fontSize: "300%"}}/>
                                <p style={{marginBottom: "3px", fontSize: "70%"}}>Unapproved</p>
                                </>
                            }
                            
                        </MultiplierBadge>
                    )}

              
                </Container>

              
        
                </StyledCardActions>

          </div>


      <CardFooter
        projectLink={"#"}
        totalStaked={3535}
        bal={324343}
        userStaked={34234234}
        blocksRemaining={"10340233"}
        isFinished={false}
        blocksUntilStart={"0"}
        poolCategory={""}
        />
        </ActualPoolCard> 
            
            
        </>
    
)
    } else if (loadingData == true){
      return (

        <>
        <DepositModal showDepositModal={showDepositModal} setShowDepositModal={setShowDepositModal}/>
        <UnstakeModal showUnstakeModal={showUnstakeModal} setShowUnstakeModal={setShowUnstakeModal} />
        
        <PlaceholderPoolCard tokenStake={POOLS[props.pid].tokenStakeName} />
            
            
        </>
    
)
    }
    
}

export default PoolCard
