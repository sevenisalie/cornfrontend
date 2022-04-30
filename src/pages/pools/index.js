
import styled from "styled-components";
import axios from "axios"
import {ethers} from "ethers";
import React, {useEffect, useState, useReducer} from "react";
import { useWeb3React } from "@web3-react/core";
import useFetchPoolData from "../../hooks/useFetchPoolData"


//static confg
import MASTERCHEF from "../../config/build/contracts/MasterChefV2.json";
import { addresses } from "../../config/addresses";
import {POOLS} from "../../config/pools";
import {MasterChefABI, ERC20Abi} from "../../config/abis";
import {writeContract} from "../../utils/nft";
import {fetchPendingCob, getUserTokenBalance} from "../../utils/fetchUserData";

//Components
import {Container, Card, Button} from "react-bootstrap";
import PoolCard from "./components/PoolCard";
import PlaceholderPoolCard from "./components/PlaceholderPoolCard"
import PoolPageHeading from "./components/PoolPageHeading"
import HowToSection from "./components/HowToSection"



//hooks
import {useRefresh} from "../../utils/useRefresh";
import useFetchBalances from "../../hooks/useFetchBalances";
import useFetchContractWrite from '../../hooks/useFetchContractWrite';
import useFetchPoolAllowances from "../../hooks/useFetchPoolAllowances"
import { GiTrousers } from "react-icons/gi";



const size = {
    mobileS: '320px',
    mobileM: '375px',
    mobileL: '425px',
    tablet: '768px',
    laptop: '1024px',
    laptopL: '1440px',
    desktop: '2560px'
  }




const PoolGrid = styled(Container)`
    margin-top: 25px;
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto;
    justify-items: center;
    align-content: start;
    column-gap: 2px;
    row-gap: 4.20em;

  
    @media (max-width: 315px) {
        margin-bottom: 6em;


    }
    @media (max-width: 2048px) {
        margin-bottom: 11em;
      }
  
    @media (max-width: 768px) {
        margin-bottom: 6em;
        flex-direction: column;
        grid-template-columns: auto;
        grid-template-rows: auto;
   
      }
`


   

  

const poolReducer = (state, action) => {
    switch (action.type) {
        case 'allowances': {
            return{
                ...state,
                allowances: action.payload,
                loading: false
            }
        }
        case 'userPoolData': {
            return {
                ...state,
                userPoolData: action.payload,
                userPoolDataLoading: false
            }
        }
        case 'poolData': {
            return {
                ...state,
                poolData: action.payload,
                poolDataLoading: false
            }
        }
        case 'masterChefContract': {
            return {
                ...state,
                masterChefContract: action.payload,
                masterChefLoading: false
            }
        }
        case "signer": {
            return {
                ...state,
                signer: action.payload
            }
        }
        case 'userBalances': {
            return {
                ...state,
                userBalances: action.payload
            }
        }
        case 'ERROR': {
            return {
                ...state,
                error: action.payload,
                loading: true
            }
        }

    

    }
    console.log("STATE")
    console.log(state)
    return state
}

const initialState = {
    preLaunch: true,
    loading: true,
    masterChefLoading: true,
    poolDataLoading: true,
    userPoolDataLoading: true,
    poolData: [],
    userPoolData: [],
    userBalances: [],
    allowances: [],
    masterChefContract: {},
    signer: {},
    error: '',
}

 const Pools = (props) => {
   
        const {active, account, library, connector} = useWeb3React();
        const [forceRefresh, setForceRefresh] = useState(false)
        const { fastRefresh } = useRefresh()
        const { state: POOLDATA } = useFetchPoolData(account, forceRefresh)
        const [state, dispatch] = useReducer(poolReducer, initialState)
        const [contract, query] = useFetchContractWrite(addresses.masterChef, MASTERCHEF["abi"])



        const [trigger, setTrigger] = useState(true)
        const [allowance] = useFetchPoolAllowances(trigger)
    

    

    useEffect( async () => {
        if (active && library && account) {
            try {
                const userBalancePromises = POOLS.map( (pool) => {
                    const promise = getUserTokenBalance(
                        active, 
                        library.getSigner(),
                        account,
                        pool.tokenStakeAddress,
                        ERC20Abi
                        )
                    return promise
                })
                const _userBalances = await Promise.all(userBalancePromises)
                
                dispatch({ type: "userBalances", payload: _userBalances})
                console.log("balances")
                console.log(_userBalances)
    
            } catch (err) {console.log(err)}
        } 
        
    }, [account, active, library])



    const manualRefresh = () => {
        console.log("BOOMHARU")
        return setTrigger(prev => !prev)
    }
    

    
    //DEV NOTE:
    // replace with 
    // if (POOLDATA.loading == false && library ) {
    //
    //we broke this intentionally for pre-release site launch
    if (POOLDATA.loading == false && library ) {
        const mapPoolData =  POOLDATA.allData.map((pool, index) => (

            <PoolCard rawPoolData={POOLS} allowances={allowance} master={contract} refresh={manualRefresh} data={POOLDATA} state={state} signer={library.getSigner()} pid={index} key={index} pool={pool}/>
            ));
        return (
            <>
    
            <PoolPageHeading/>

                <HowToSection />
                
        
                <PoolGrid >
                    {mapPoolData}
                </PoolGrid>
        
            </>
        )

    //DEV NOTE:
    // replace with 
    // } else if (POOLDATA.loading == true || !library) {
    //
    //we broke this intentionally for pre-release site launch

    } else if (POOLDATA.loading == true || !library) {
        const mapPlaceHolderPoolData = POOLS.map( (pool) => (
            <PlaceholderPoolCard data={pool} tokenStake={pool.tokenStakeName}/>
        ))
        return (
            <>
    
            <PoolPageHeading/>
            
                <HowToSection />

                <PoolGrid>
                    {mapPlaceHolderPoolData}
                </PoolGrid>
      
            
            
    
            </>
        )
    }
      

}

export default Pools