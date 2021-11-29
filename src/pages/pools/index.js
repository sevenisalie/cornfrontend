
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
    row-gap: 20px;
    margin-bottom: 25px;

    @media (max-width: 768px) {
        flex-direction: column;
        grid-template-columns: auto;
        grid-template-rows: auto;
      }
  
`

const HeadingContainer = styled(Container)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 15px;
`

const HeadingBackground = styled(Card)`
    height: auto;
    width: 100%;
    padding: 20px;
    background-color: #1D1E20;
    box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
`

const BigHeading = styled.h1`
    font-size: 280%;
    font-weight: 800;
    color:  #fbdb37;
    
`
const LittleHeading = styled.h2`
    font-size: 200%;
    font-weight: 600;
    color: #fbfbfb;
    
`


const Pools = () => {
   
    const {active, account, library, connector} = useWeb3React();
    const [poolData, setPoolData] = useState(pools); //imported above
    const [masterChefContract, setMasterChefContract] = useState()
    const [poolBalance, setPoolBalance] = useState('0')
    const { fastRefresh } = useRefresh()
    const [allowances, setAllowances] = useState('false')
    const [balances, setBalances] = useState('0')
    
    
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
                console.log(val)
              })
        } else {
            console.log("no masterchef")
          const noData = setMasterChefContract(null)
        }
        
        
      }, [active])

    useEffect( async () => {
     
            
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
    
              
       }, [masterChefContract, fastRefresh])

    useEffect( async () => {

        try {
            console.log(`This is poolData inside function ${poolData}`)
            console.log(poolData)
            const poolbl = await getPoolBalance(poolData, active, library.getSigner(), account, ERC20Abi, masterChefContract, 4)
            //const poolbal = ethers.utils.formatUnits(poolbl, "ether")
            setPoolBalance(poolbl)
            console.log("poolbally")
            console.log(poolbl)          
    

        } catch (err) {
            console.log(err)
        }
    }, [poolData, active, library])

    //if we do have pooldata then go ahead and populate a card for each pool
    if (masterChefContract !== null && active && balances != undefined) {
            const mapPoolData =  poolData.map((pool, index) => (

                <PoolCard balance={balances[index]} allowance={allowances[index]} masterChef={masterChefContract} signer={library.getSigner()} pid={index} poolBalance={poolBalance[index]} pool={pool}/>
                ));
      



        return (
            <>
            <HeadingContainer>
                <HeadingBackground>
                    <BigHeading>Staking Pools</BigHeading>
                    <LittleHeading>Stake Assets to Earn COB</LittleHeading>
                </HeadingBackground>
            </HeadingContainer>
            <PoolGrid>
                {mapPoolData}
            </PoolGrid>
            
            
    
            </>
        )
    }
   
    //if we dont have pool data then return static dummy
    return (
        <>
        <Page>

            <HeadingContainer>
                <HeadingBackground>
                    <BigHeading>Staking Pools</BigHeading>
                    <LittleHeading>Stake Assets to Earn COB</LittleHeading>
                </HeadingBackground>
            </HeadingContainer>

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