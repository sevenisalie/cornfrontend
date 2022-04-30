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
import {goodToast} from "../../../components/Toast"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


//icons
import {GoVerified} from "react-icons/go"
import {FaCircle, FaRegCircle, FaRegCheckCircle} from "react-icons/fa"
import {BiCoinStack, BiDollarCircle} from "react-icons/bi"
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
    const { fastRefresh, slowRefresh } = useRefresh()
    const [showDepositModal, setShowDepositModal] = useState(false)
    const [showUnstakeModal, setShowUnstakeModal] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const [masterChef, setMasterChef] = useState('')
  
    const [allowance, setAllowance] = useState(false)
    const [pendingCob, setPendingCob] = useState('')
    const [isOpen, setIsOpen] = useState(false)

    //apyv2
    // catch previous reduced state
    const [data, setData] = useState({})

    useEffect(() => {
      setData(props.data.allData[props.pid])
    }, [props.data])
    
    useEffect(() => {
      console.log("ALLOWANZ")
      console.log(props.allowances)
      setAllowance(props.allowances[props.pid].approved)
    }, [props.allowances])

    useEffect(() => {
      setLoadingData(props.data.loading)
    }, [props.data])

    
 





  useEffect(() => {
    
      setMasterChef(props.master)
     
  }, [props.master])

  
  const fetchPending = async () => {

    try {

      const pendingCob = await masterChef.pendingCob(props.pid, account)
      setPendingCob(ethers.utils.formatUnits(pendingCob, 18))
    } catch (err) {
      console.log(err)
    }
  }
  
  useEffect(  () => {
    if (masterChef !== '') {
      if (account) {
        try {
          fetchPending()
          console.log(props.state)
        } catch (err) {
          console.log(err)
        }
        
      }
    }

  }, [account, masterChef, slowRefresh])


 
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
        goodToast(`Confirming Transaction`)
        const raw = await userClaim(masterChef, pid)
        console.log("TRANNNY")
        console.log(raw)
        const tx = await raw.wait()
        console.log(tx)

          if (tx.status === 1) {
            goodToast(`Rewards Claimed`)
          } 
        
          
      } catch (err) {
        console.log(err)
      }
    }


    const handleApproveClick = async (token) => {
      try {
        goodToast("Confirming Transaction");
        

        console.log("TRANS")
        console.log(token)
        //pid, tokenAddress, masterchef, _signer
          const tx = await setPoolAllowance(token, masterChef, library.getSigner())
          if (tx.status === 1) {
            goodToast("Pool Approved - Happy Farming!");
            props.refresh()
          }

      } catch (err) {
        console.log(err)
      }
    }
    
    
    const handleDetailsClick = () => setIsOpen(!isOpen)

    const LoadingElement = (_length) => {
      return (
        <Placeholder style={{width: "3.5em"}} as="p" animation="glow" >
          <Placeholder lg={_length} />
        </Placeholder>
      )
    }

    if (props.rawPoolData[props.pid].display === false) {
      return (
        null
      )
    } else {
      return (

        <>
        <DepositModal data={props.data} tokenStake={POOLS[props.pid].tokenStakeName} imageurl={POOLS[props.pid].imageurl}  pid={props.pid} showDepositModal={showDepositModal} setShowDepositModal={setShowDepositModal} />
        <UnstakeModal data={props.data} tokenUnstake={POOLS[props.pid].tokenStakeName} imageurl={POOLS[props.pid].imageurl} pid={props.pid}  showUnstakeModal={showUnstakeModal} setShowUnstakeModal={setShowUnstakeModal} />

        <ActualPoolCard isOpen={isOpen}>
                    

          <div style={{ padding: '24px' }}>
          
              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: "wrap", alignItems: 'center', justifyContent: "space-between"}}>
              
                  <Image style={{ marginRight: "19px" }}src={data.imageurl} width={64} height={64} alt={"COB"} />
                  
                <CardTitle >
                  
                 
                  <div style={{display: "flex", flexDirection: 'column', alignContent: "center", justifyContent: "space-between", textAlign: "center", marginBottom: "12px"}}>
                    {data.tokenStakeName} 
                  </div>

                  <MultiplierBadge><GoVerified style={{marginRight: "4px"}}/>
                  {toFixed(data.depositFee, 1)} 
                  {" Fees"}
                  </MultiplierBadge>

                  <MultiplierBadge>
                  {data.multiplier}
                  </MultiplierBadge>

                </CardTitle>
              </div>
            

                <StyledDetails>
                    <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                      
                     
                    </Container>
            
                </StyledDetails>

                <StyledDetails>
                    <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                      <p>APR:</p>
                 
                      <p>
                        {/* {JSON.stringify(data.APY, null, 2)} */}
                      {data.APY ? toFixed(data.APY.APY, 2) : LoadingElement(12)} %
                      </p>
                     
                    </Container>
            
                </StyledDetails>
                
                <StyledDetails>
                <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                      <p>Earn:</p>
                      <p><BiCoinStack style={{marginRight: "6px"}}/>
                        {data.tokenEarnName}
                      </p>
                    </Container>
                </StyledDetails>

                <StyledDetails>
                <Container style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                      <p>Stake:</p>
                      <p><RiCoinLine style={{marginRight: "6px"}}/>
                      {data.tokenStakeName}
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
                    <ApproveButton onClick={async () => handleApproveClick(POOLS[props.pid].tokenStakeAddress)}>
                        {`Approve Contract`}
                    </ApproveButton>
                    )}


                    {allowance == true ? (
                        <MultiplierBadge style={{margin: "0px !important", alignSelf: "end", }}>

                                <FaCircle style={{marginBottom: "5px", fontSize: "240%"}}/>
                                <p style={{marginBottom: "3px", fontSize: "70%"}}>Approved</p>
                            
                        </MultiplierBadge>
                    ) : (
                        <MultiplierBadge style={{padding: "6px", margin: "0px !important", alignSelf: "end", }}>
                          
                                <FaRegCircle style={{marginBottom: "0px", fontSize: "300%"}}/>
                                <p style={{marginBottom: "3px", fontSize: "70%"}}>Unapproved</p>
                           
                        </MultiplierBadge>
                    )}

              
                </Container>

              
        
                </StyledCardActions>

          </div>


        <CardFooter
          setIsOpen={handleDetailsClick}
          isOpen={isOpen}
          state={props.state}
          data={data}
          projectLink={data.poolurl}
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
    }

    
     
                    
}

export default PoolCard
