import styled from "styled-components";
import {ethers} from "ethers";
import React, {useEffect, useState} from "react";
import { Link } from 'react-router-dom'
import { useWeb3React } from "@web3-react/core";
import axios from "axios"

import {POOLS} from "../../../config/pools";
import {useRefresh} from "../../../utils/useRefresh";
import { stringToFixed, userClaim, fetchPoolAllowance, setPoolAllowance, toFixed, getTokenStakeBalance, userStake, userUnstake} from "../../../utils/nft"
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
    display: flex;
    flex-direction: column;
    height: ${props => props.isOpen ? "auto" : "37em"};
    backdrop-filter: blur(12px) saturate(149%);
    -webkit-backdrop-filter: blur(0px) saturate(149%);
    background-color: rgba(29, 30, 32, 0.57);
    border: 1px solid rgba(255, 255, 255, 0.125);
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
    const [isOpen, setIsOpen] = useState(false)
    

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
        console.log(props.state)
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

    const ToastStyle = {
      borderRadius: "50px",
      backdropFilter: "blur(12px) saturate(149%)",
      backgroundColor: "rgba(29, 30, 32, 0.57)",
      border: "1px solid rgba(255, 255, 255, 0.125)",
    }

    const handleClaimClick = async (pid) => {
      try {
        const id = toast.loading("Please wait...", {
          style: ToastStyle,
          position: toast.POSITION.BOTTOM_RIGHT, closeOnClick: true, draggable: true})
        const raw = await userClaim(masterChef, pid)
        console.log("TRANNNY")
        console.log(raw)
        const tx = await raw.wait()
        console.log(tx)
        if (tx) {

          if (tx.status == 1) {
            toast.update(id, { render: "Rewards Claimed.", position: "bottom-right", type: "success", autoClose: 5000, className: 'rotateY animated', draggable: true, isLoading: false });

          } else {
            toast.update(id, { render: "Problem Claiming Rewards. Check Gas Settings.", position: "bottom-right", type: "error", draggable: true, isLoading: false });
          }
        } else if (tx === undefined) {
          toast.update(id, { render: "User Cancelled Transaction", position: "bottom-right", type: "error", draggable: true, isLoading: false });

        }
          
      } catch (err) {
        console.log(err)
        badToast(`Something Went Wrong....Try Claiming Rewards Again`)
      }
    }


    const handleApproveClick = async (token) => {
      try {
        //pid, tokenAddress, masterchef, _signer
        const id = toast.loading("Please wait...", {
          style: ToastStyle,
          position: toast.POSITION.BOTTOM_RIGHT, closeOnClick: true, draggable: true})
        const raw = await setPoolAllowance(token, props.state.masterChefContract, props.state.signer)
        const tx = await raw.wait()
        if (tx) {

          if (tx.status == 1) {
            toast.update(id, { render: "Approved Pool.", position: "bottom-right", type: "success", autoClose: 5000, className: 'rotateY animated', draggable: true, isLoading: false });

          } else {
            toast.update(id, { render: "Problem Approving Pool. Check Gas Settings.", position: "bottom-right", type: "error", draggable: true, isLoading: false });
          }
        } else if (tx === undefined) {
          toast.update(id, { render: "User Cancelled Transaction", position: "bottom-right", type: "error", draggable: true, isLoading: false });

        }
      } catch (err) {
        console.log(err)
      }
    }
    
    const handleStakeOnClick = async (poolId, amount) => {
      try {
          if (active) {
            const id = toast.loading("Please wait...", {
              style: ToastStyle,
              position: toast.POSITION.BOTTOM_RIGHT, closeOnClick: true, draggable: true})
              const raw = await userStake(masterChef, poolId, amount)
              console.log("TRANNNY")
              console.log(raw)
              const tx = await raw.wait()
              setShowDepositModal(false)
                  if (tx) {

                    if (tx.status == 1) {
                      toast.update(id, { render: "Staked in Pool.", position: "bottom-right", type: "success", autoClose: 5000, className: 'rotateY animated', draggable: true, isLoading: false });
          
                    } else {
                      toast.update(id, { render: "Problem Staking in Pool. Check Gas Settings.", position: "bottom-right", type: "error", draggable: true, isLoading: false });
                    }
                    } else if (tx === undefined) {
                    toast.update(id, { render: "User Cancelled Transaction", position: "bottom-right", type: "error", draggable: true, isLoading: false });
          
                  }
          }  
        } catch (err) {
          console.log(err)
          badToast(`Something Went Wrong... Try Staking in the Pool Again`)
        }

    }

    const handleUnstakeOnClick = async (pid, amount) => {
      try {

          if (active) {
            const id = toast.loading("Please wait...", {
              style: ToastStyle,
              position: toast.POSITION.BOTTOM_RIGHT, closeOnClick: true, draggable: true})
              const raw = await userUnstake(masterChef, pid, amount)
              const tx = await raw.wait()
              setShowUnstakeModal(prev => !prev)
                if (tx) {

                  if (tx.status == 1) {
                    toast.update(id, { render: "Unstaked from Pool.", position: "bottom-right", type: "success", autoClose: 5000, draggable: true,  className: 'rotateY animated', isLoading: false });
        
                  } else {
                    toast.update(id, { render: "Problem Unstaking from Pool. Check Gas Settings.", position: "bottom-right", type: "error", draggable: true, isLoading: false });
                  }
                  } else if (tx === undefined) {
                  toast.update(id, { render: "User Cancelled Transaction", position: "bottom-right", type: "error", draggable: true,  isLoading: false });
        
                }


          }  
      } catch (err) {console.log(err)}

    }
    const handleDetailsClick = () => setIsOpen(!isOpen)







  if (props.state.poolDataLoading == false) {
      
      return (

        <>
        <DepositModal state={props.state} handleStakeOnClick={handleStakeOnClick} tokenStake={POOLS[props.pid].tokenStakeName} imageurl={POOLS[props.pid].imageurl}  pid={props.pid} showDepositModal={showDepositModal} setShowDepositModal={setShowDepositModal} />
        <UnstakeModal state={props.state} handleUnstakeOnClick={handleUnstakeOnClick} tokenUnstake={POOLS[props.pid].tokenStakeName} imageurl={POOLS[props.pid].imageurl} pid={props.pid}  showUnstakeModal={showUnstakeModal} setShowUnstakeModal={setShowUnstakeModal} />

        <ActualPoolCard isOpen={isOpen}>

          <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: "wrap", alignItems: 'center', justifyContent: "space-between"}}>
                <CoinCard>
                  {loadingData == true
                  ?
                  <LoadingSpinner />
                  :
                  <Image style={{ marginRight: "19px" }}src={`/assets/images/CornLogo.png`} width={64} height={64} alt={"COB"} />
                  }
                </CoinCard>
                <CardTitle >
                  
                 
                  <div style={{display: "flex", flexDirection: 'column', alignContent: "center", justifyContent: "space-between", textAlign: "center", marginBottom: "12px"}}>
                    {POOLS[props.pid].tokenStakeName} 
                  </div>

                  <MultiplierBadge><GoVerified style={{marginRight: "4px"}}/>
                  {loadingData == true ? toFixed(props.state.poolData[props.pid].DepositFeePercent, 1) : toFixed(props.state.poolData[props.pid].DepositFeePercent, 1)}
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
                     
                      {
                      props.state.userPoolDataLoading == false
                      ?
                      <p><GiLockedChest style={{marginRight: "6px", color: "#fbfbfb"}}/>
                        {toFixed(props.state.userPoolData[props.pid].USER.poolTVL, 2)}
                      </p>
                      :
                      <Placeholder style={{width: "3.5em", height: "auto"}} as="h2" animation="glow">
                            <Placeholder lg={12} />
                      </Placeholder>
                      }
                    </Container>
            
                </StyledDetails>

                <StyledDetails>
                    <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                      <p>APR:</p>
                      
                      {
                      props.state.userPoolDataLoading == false
                      ?
                      <p>
                      {toFixed(props.state.userPoolData[props.pid].USER.APY, 2)} %
                      </p>
                      :
                      <Placeholder style={{width: "3.5em", height: "auto"}} as="h2" animation="glow">
                            <Placeholder lg={12} />
                      </Placeholder>
                      }

                      
                    </Container>
            
                </StyledDetails>
                
                <StyledDetails>
                <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                      <p>Earn:</p>
                      <p><BiCoinStack style={{marginRight: "6px"}}/>
                        {props.state.poolData[props.pid].EarnToken.symbol}
                      </p>
                    </Container>
                </StyledDetails>

                <StyledDetails>
                <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                      <p>Stake:</p>
                      <p><RiCoinLine style={{marginRight: "6px"}}/>
                      {POOLS[props.pid].tokenStakeName}
                      </p>
                    </Container>
                </StyledDetails>

                <StyledDetails>
                <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                      <Container style={{ margin: "3px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                          <p style={{fontSize: "60%", fontWeight: "800"}}>
                              {`COB Earned:`}
                              </p>
                            {
                              props.state.userPoolDataLoading == false
                              ?
                              <p style={{color: "#fbdb37", fontSize: "110%", fontWeight: "600"}}>
                              {toFixed(pendingCob, 2)}
                              </p>
                              :
                              <Placeholder style={{width: "3.5em", height: "auto"}} as="h2" animation="glow">
                                <Placeholder lg={12} />
                              </Placeholder>
                            }
                           
                      </Container>
                      <ClaimButton state={props.state} onClick={async () => handleClaimClick(props.pid)}>
                            {`Claim`}
                        </ClaimButton>
                    </Container>
                </StyledDetails>

                <Label  text={'COB earned'}/>
                <StyledCardActions>
      

                <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>

                    {allowance == true ? (
                    <>
                        <StakeButton  onClick={() => handleModalOnClick()}>
                            {`Stake`}
                        </StakeButton>
                        <UnstakeButton onClick={() => handleUnstakeModalOnClick()}>
                            {`Unstake`}
                        </UnstakeButton>
                    </>
                    ) : (
                    <ApproveButton onClick={async () => handleApproveClick(props.state.poolData[props.pid].DepositToken.address)}>
                        {`Approve Contract`}
                    </ApproveButton>
                    )}


                    {allowance == true ? (
                        <MultiplierBadge style={{margin: "0px !important", alignSelf: "end", }}>

                          {props.state.userPoolDataLoading == true 
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
                            {props.state.userPoolDataLoading == true 
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
        setIsOpen={handleDetailsClick}
        isOpen={isOpen}
        state={props.state}
        projectLink={POOLS[props.pid].poolurl}
        pid={props.pid}
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
    } else if (props.state.poolDataLoading == true){
      return (

        <>
        <DepositModal state={props.state} tokenStake={POOLS[props.pid].tokenStakeName} showDepositModal={showDepositModal} setShowDepositModal={setShowDepositModal}/>
        <UnstakeModal state={props.state} tokenUnstake={POOLS[props.pid].tokenStakeName} showUnstakeModal={showUnstakeModal} setShowUnstakeModal={setShowUnstakeModal} />
        
        <PlaceholderPoolCard tokenStake={POOLS[props.pid].tokenStakeName} />
            
            
        </>
    
)
    }
    
}

export default PoolCard
