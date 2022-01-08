
import styled from "styled-components";
import axios from "axios"
import {ethers} from "ethers";
import React, {useEffect, useState} from "react";
import { useWeb3React } from "@web3-react/core";

//static confg


import { addresses } from "../../config/addresses";
import {pools} from "../../config/pools";
import {MasterChefABI, ERC20Abi} from "../../config/abis";
import {writeContract, fetchPoolAllowance, getTokenStakeBalance, fetchTokenStakeBalance} from "../../utils/nft";
import {fetchUserPoolData, mapPendingToOriginalData, getPoolBalance} from "../../utils/fetchUserData";
//Components
import {Page} from "../../components/Page"
import {Container, Card, Button} from "react-bootstrap";
import PoolCard from "./components/PoolCard";
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




const Pools = (props) => {
   
    const {active, account, library, connector} = useWeb3React();
    const [poolData, setPoolData] = useState(pools); //imported above
    const [masterChefContract, setMasterChefContract] = useState()
    const [poolBalance, setPoolBalance] = useState('0')
    const { fastRefresh } = useRefresh()
    const [allowances, setAllowances] = useState('false')
    const [balances, setBalances] = useState('0')
    const [apiPoolData, setApiPoolData] = useState({})

    useEffect( async () => {
        if (account) {
            try {
                const poolData = await axios.get(`https://cornoracleapi.herokuapp.com/chef/userPoolData/${account}`)
                if (poolData.status == 200) {
                    setApiPoolData(poolData.data)
                } else {
                    setApiPoolData({})
                }
            } catch (err) {}
        }

        
    }, [account])
    
    
    useEffect( () => {
        if (active) {
          const master = writeContract(
              active, 
              library.getSigner(), 
              account,
              addresses.masterChef,
              MasterChefABI,
              ).then(val => {
                setMasterChefContract(val)
              })
        } else {
            console.log("no masterchef")
          const noData = setMasterChefContract(null)
        }
      }, [active])

    useEffect( async () => {
     
            try {

                if (library && account) {
            
                    const farmData = await fetchUserPoolData(masterChefContract, library, account, 4)
                    const userFarmData = await mapPendingToOriginalData(farmData, pools, masterChefContract, 4)
                    const alounces = await fetchPoolAllowance(userFarmData, library.getSigner(), account, masterChefContract)
                    const bal = await fetchTokenStakeBalance(userFarmData, library.getSigner(), account)
                    setBalances(bal)
                    setPoolData(userFarmData)
                    setAllowances(alounces)
                } else {
                    console.log("stillbroke no pooldata")
                    setPoolData(pools)
                    setAllowances("false")
                    setBalances('0')
                }

            } catch (err) {console.log(err)}
            
    
              
       }, [masterChefContract, fastRefresh])

    useEffect( async () => {

        try {
           
            const poolbl = await getPoolBalance(poolData, active, library.getSigner(), account, ERC20Abi, masterChefContract, 4)
            //const poolbal = ethers.utils.formatUnits(poolbl, "ether")
            setPoolBalance(poolbl)
                   
    

        } catch (err) {
            console.log(err)
        }
    }, [poolData, active, library])

    //if we do have pooldata then go ahead and populate a card for each pool
    if (masterChefContract !== null && active && balances != undefined) {
            const mapPoolData =  poolData.map((pool, index) => (

                <PoolCard apiPoolData={apiPoolData[index]} balance={balances[index]} allowance={allowances[index]} masterChef={masterChefContract} signer={library.getSigner()} pid={index} poolBalance={poolBalance[index]} pool={pool}/>
                ));
      



        return (
            <>
  
            <PoolPageHeading/>
            
            <PoolGrid style={{marginBottom: "6.5em"}}>
                {mapPoolData}
            </PoolGrid>
            
            
    
            </>
        )
    }
   
    //if we dont have pool data then return static dummy
    return (
        <>
        <Page>

            <PoolPageHeading/>

            <PoolGrid>

                <PoolCard/>
                <PoolCard/>
                <PoolCard/>
                
            
            </PoolGrid>
            

        </Page>

        </>
    )
}

export default Pools