
import styled from "styled-components";
import axios from "axios"
import {ethers} from "ethers";
import React, {useEffect, useState, useReducer} from "react";
import { useWeb3React } from "@web3-react/core";
import useFetchPoolData from "../../hooks/useFetchPoolData"


//static confg


import { addresses } from "../../config/addresses";
import {POOLS} from "../../config/pools";
import {MasterChefABI, ERC20Abi} from "../../config/abis";
import {writeContract} from "../../utils/nft";
import {fetchPendingCob, getUserTokenBalance} from "../../utils/fetchUserData";

//Components
import {Page} from "../../components/Page"
import {Container, Card, Button} from "react-bootstrap";
import PoolCard from "./components/PoolCard";
import PlaceholderPoolCard from "./components/PlaceholderPoolCard"
import PoolPageHeading from "./components/PoolPageHeading"
import BackdropFilter from "react-backdrop-filter";
import PoolFilter from "./components/PoolFilter"



//hooks
import {useRefresh} from "../../utils/useRefresh";
import useFetchBalances from "../../hooks/useFetchBalances";



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
        case 'sortAPY': {
            return {
                ...state,
                sortAPY: action.payload
            }
        }
        case 'sortTVL': {
            return {
                ...state,
                sortTVL: action.payload
            }
        }
        case 'sortStaked': {
            return {
                ...state,
                sortStaked: action.payload
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
    sortAPY: false,
    sortTVL: false,
    sortStaked: false,
    signer: {},
    error: '',
}

 const Pools = (props) => {
   
        const {active, account, library, connector} = useWeb3React();
        const { fastRefresh } = useRefresh()
        const { state: POOLDATA } = useFetchPoolData(account)
        const [state, dispatch] = useReducer(poolReducer, initialState)

    
    const setSortAPY = () => {
        dispatch({ type: "sortAPY", payload: true})
        dispatch({ type: "sortTVL", payload: false})
        dispatch({ type: "sortStaked", payload: false})
    }
    const setSortTVL = () => {
        dispatch({ type: "sortTVL", payload: true})
        dispatch({ type: "sortAPY", payload: false})
        dispatch({ type: "sortStaked", payload: false})
    }
    const setSortStaked = () => {
        dispatch({ type: "sortStaked", payload: true})
        dispatch({ type: "sortAPY", payload: false})
        dispatch({ type: "sortTVL", payload: false})
    }
    
    useEffect(() => {
        console.log("TESTING THIS SHIT")
    }, [state.sortAPY, state.sortTVL, state.sortStaked])

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

   

    useEffect( async () => {
        if (active && library) {
            try {
            
                const master = await writeContract(
                    active, 
                    library.getSigner(), 
                    account,
                    addresses.masterChef,
                    MasterChefABI,
                    )
                
                dispatch({ type: "masterChefContract", payload: master})
                dispatch({type: 'signer', payload: library.getSigner()})
                console.log("MASETERRR")
                console.log(state)
            } catch (err) {
                console.log(err)
                dispatch({type: 'ERROR', payload: err})
            }
        }

      }, [active, library])

      


    
    const mapPoolDataApy = () => {
        const apyDescending = POOLDATA.allData.sort( (a, b) => 
            

            parseFloat(b.APY.APY) - parseFloat(a.APY.APY)
          
        )
        return apyDescending
    }
    const mapPoolDataTvl = () => {
        const tvlDescending = POOLDATA.allData.sort( (a, b) => 
            

            parseFloat(b.APY.poolTVL) - parseFloat(a.APY.poolTVL)
          
        )
        return tvlDescending
    }
    const mapPoolDataStaked = () => {
        const stakedDescending = POOLDATA.allData.sort( (a, b) => 
            

            parseFloat(b.USER.stakedAmount) - parseFloat(a.USER.stakedAmount)
          
        )
        return stakedDescending
    }

    //if we do have pooldata then go ahead and populate a card for each pool
    if (POOLDATA.loading == false && library ) {



        let mapPoolData =  POOLDATA.allData.map((pool, index) => (

            <PoolCard data={POOLDATA} state={state} signer={library.getSigner()} pid={index} key={index} pool={pool}/>
            ));
        if (state.sortAPY == true) {
            const byAPY = mapPoolDataApy()
            mapPoolData =  byAPY.map((pool, index) => (

            <PoolCard data={POOLDATA} state={state} signer={library.getSigner()} pid={index} key={index} pool={pool}/>
            ));
        }
        if (state.sortTVL == true) {
            mapPoolData =  POOLDATA.allData.map((pool, index) => (

            <PoolCard data={POOLDATA} state={state} signer={library.getSigner()} pid={index} key={index} pool={pool}/>
            ));
        }
        if (state.sortStaked == true) {
            mapPoolData =  POOLDATA.allData.map((pool, index) => (

            <PoolCard data={POOLDATA} state={state} signer={library.getSigner()} pid={index} key={index} pool={pool}/>
            ));
        }


        return (
            <>
    
            <PoolPageHeading/>

                
            <PoolFilter state={state} setSortAPY={setSortAPY} setSortTVL={setSortTVL} setSortStaked={setSortStaked} />

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

    } else if (POOLDATA.loading ==true && state.preLaunch == true ) {
        const mapPlaceHolderPoolData = POOLS.map( (pool) => (
            <PlaceholderPoolCard tokenStake={pool.tokenStakeName}/>
        ))
        return (
            <>
    
            <PoolPageHeading/>
            
      
                <PoolGrid>
                    {mapPlaceHolderPoolData}
                </PoolGrid>
      
            
            
    
            </>
        )
    }
      

}

export default Pools