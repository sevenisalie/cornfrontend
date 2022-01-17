
import styled from "styled-components";
import axios from "axios"
import {ethers} from "ethers";
import React, {useEffect, useState, useReducer} from "react";
import { useWeb3React } from "@web3-react/core";

//static confg


import { addresses } from "../../config/addresses";
import {POOLS} from "../../config/pools";
import {MasterChefABI, ERC20Abi} from "../../config/abis";
import {writeContract} from "../../utils/nft";
import {fetchPendingCob} from "../../utils/fetchUserData";
//Components
import {Page} from "../../components/Page"
import {Container, Card, Button} from "react-bootstrap";
import PoolCard from "./components/PoolCard";
import PlaceholderPoolCard from "./components/PlaceholderPoolCard"
import PoolPageHeading from "./components/PoolPageHeading"
import BackdropFilter from "react-backdrop-filter";



//hooks
import {useRefresh} from "../../utils/useRefresh";




const PoolGrid = styled(Container)`
    margin-top: 25px;
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto;
    justify-items: center;
    align-content: start;
    column-gap: 2px;
    row-gap: 4.20em;
    margin-bottom: 25px;

    @media (max-width: 768px) {
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
    loading: true,
    masterChefLoading: true,
    poolDataLoading: true,
    userPoolDataLoading: true,
    poolData: [],
    userPoolData: [],
    allowances: [],
    masterChefContract: {},
    signer: {},
    error: '',
}

const Pools = (props) => {
   
    const {active, account, library, connector} = useWeb3React();
    const { fastRefresh } = useRefresh()
    

    const [state, dispatch] = useReducer(poolReducer, initialState)

    useEffect( async () => {
        try {
            if (account){
                const data = await axios.get(`https://cornoracleapi.herokuapp.com/chef/userPoolData/${account}`)
                dispatch({ type: 'userPoolData', payload: data.data })
                console.log("USERDATA")
            }

        } catch (err) {
            dispatch({ type: 'ERROR', payload: err })
        }

    }, [account, active])
    useEffect( async () => {
        try {
            const data = await axios.get(`https://cornoracleapi.herokuapp.com/chef/poolData`)
            dispatch({ type: `poolData`, payload: data.data})
            console.log("POOLDATA")
        } catch (err) {
            dispatch({ type: 'ERROR', payload: err })
        }
    }, [])
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
            } catch (err) {
                console.log(err)
                dispatch({type: 'ERROR', payload: err})
            }
        }

      }, [active, library])


    

    

    //if we do have pooldata then go ahead and populate a card for each pool
    if (state.poolDataLoading == false && library) {
        const mapPoolData =  state.poolData.map((pool, index) => (

            <PoolCard  state={state} signer={library.getSigner()} pid={index} pool={pool}/>
            ));
            return (
                <>
        
                <PoolPageHeading/>
                
            
                    <PoolGrid style={{marginBottom: "6.5em"}}>
                        {mapPoolData}
                    </PoolGrid>
           
                
                
        
                </>
            )
    } else if (state.poolDataLoading == true || !library) {
        const mapPlaceHolderPoolData = POOLS.map( (pool) => (
            <PlaceholderPoolCard tokenStake={pool.tokenStakeName}/>
        ))
        return (
            <>
    
            <PoolPageHeading/>
            
      
                <PoolGrid style={{marginBottom: "6.5em"}}>
                    {mapPlaceHolderPoolData}
                </PoolGrid>
      
            
            
    
            </>
        )
    }
      


        
    
        
       
}

export default Pools