import {ethers} from "ethers"
import {Provider, Contract} from "ethers-multicall"
import BigNumber from "bignumber.js";
import {axios} from "axios"
import {addresses} from "../config/addresses"
import {POOLS} from "../config/pools"
import {ERC20Abi} from "../config/abis"
import MASTERCHEF from "../config/build/contracts/MasterChefV2.json"

import { toFixed } from "./nft"



//READ REWARDS

export const resolvePendingCobCalls = async (calls, provider) => {
    try {
        const callProvider = new Provider(provider, 137)

        const results = await callProvider.all(calls)
    
        const cleanedResults = results.map( (result) => {
            return ethers.utils.formatUnits(result, 18)
        })
        return cleanedResults
    } catch (err) {console.log(err)}

}

export const mapPendingCobCalls = async (provider, account) => {
    try {
        const masterChef = new Contract(
            addresses.masterChef,
            MASTERCHEF.abi
        )
    
        const pendingCalls = POOLS.map( pool => 
            masterChef.pendingCob(pool.pid, account)
        )
    
        const data = await resolvePendingCobCalls(pendingCalls, provider)

        return data
    } catch (err) {console.log(err)}
    
}


//CLAIM REWARDS

export const resolvePendingClaimCalls = async (calls, provider) => {
    try {
        const callProvider = new Provider(provider, 137)

        const results = await callProvider.all(calls)
        return results
    } catch (err) {console.log(err)}

}

export const mapPendingClaimCalls = async (provider, account) => {
    try {
        const masterChef = new ethers.Contract(
            addresses.masterChef,
            MASTERCHEF.abi,
            provider
        )

        const rewards = await mapPendingCobCalls(provider, account)

        const filteredPIDS = rewards.map( (reward, index) => {
            console.log("THIS IS CASUING UR PROBLEM")
            console.log(reward)
            console.log(typeof(reward))
            if (reward !== '0.0') {
                
                console.log(index)
                return index
            } else {
                return
            }
        })

        const filteredFilteredPIDS = filteredPIDS.filter(pid => {
            return pid !== undefined
        })
    
        const pendingCalls = filteredFilteredPIDS.map( pid => {
            return masterChef.deposit(pid, 0)
        })
    
        const data = await resolvePendingClaimCalls(pendingCalls, provider)
        return data
    } catch (err) {console.log(err)}

}


//POOL APPROVAL


export const resolvePoolAllowances = async (calls, provider) => {
    try {
        const callProvider = new Provider(provider, 137)

        const results = await callProvider.all(calls)
        return results
    } catch (err) {console.log(err)}

}

export const mapPoolAllowances = async (account, provider) => {
    try {
 
    
        const pendingCalls = POOLS.map( (pool) => {
            const ERC20 = new Contract(
                pool.tokenStakeAddress,
                ERC20Abi,
            )

            return ERC20.allowance(account, addresses.masterChef)
        })
    
        const data = await resolvePoolAllowances(pendingCalls, provider)

        const boolData = data.map( (datum) => {
            const formattedAllowance = ethers.utils.formatUnits(datum, "ether");

            if (formattedAllowance !== "0.0") {
                return {approved: true}
            } else {
                return {approved: false}
            }
        })

        return boolData
        
    } catch (err) {
        console.log("MULTICALL ERROR")
        console.log(err)
    }

}

// cob token details

export const resolveTokenDetailCalls = async (calls, provider) => {
    try {
        const callProvider = new Provider(provider, 137)

        const data = await callProvider.all(calls)
        return data
    } catch (err) {
        console.log(err)
    }
}


export const mapTokenDetailCalls = async (provider) => {
    try {
        const cob = new Contract(
            addresses.tokens.COB,
            ERC20Abi,
        )
        const usdc = new Contract(
            addresses.tokens.USDC,
            ERC20Abi,
        )
        const lp = addresses.tokens.lp.COBUSDC
        const totalSupply =  cob.totalSupply()
        const tokenALpBalance =  cob.balanceOf(lp)
        const tokenBLpBalance =  usdc.balanceOf(lp)
        const calls = [totalSupply, tokenALpBalance, tokenBLpBalance]

        const data = await resolveTokenDetailCalls(calls, provider)

        //crunching
        const numTotalSupply = parseFloat(ethers.utils.formatUnits(data[0], 18))
    
        const cobLpBalance = parseFloat(ethers.utils.formatUnits(data[1], 18))
    
        const UsdcLpBalance = parseFloat(ethers.utils.formatUnits(data[2], 6))

        const tokenPriceVsQuote = new BigNumber(UsdcLpBalance).div(new BigNumber(cobLpBalance))
        const price = tokenPriceVsQuote.toPrecision()
        const mc = price * numTotalSupply
        const cleanMarketCap = toFixed(mc, 3)
        const cleanPrice = toFixed(price, 5)
        BigNumber.config({ EXPONENTIAL_AT: 1e+9 })
       
    
        const cleanData = {
            supply: numTotalSupply,
            price: cleanPrice,
            marketCap: cleanMarketCap
    
        }
        return cleanData
    } catch (err)  {
        console.log("BRAIL ERROR")
        console.log(err)
    }
}



