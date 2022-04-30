import {ethers} from "ethers"
import {Provider, Contract} from "ethers-multicall"
import {addresses} from "../config/addresses"
import {POOLS} from "../config/pools"
import {ERC20Abi} from "../config/abis"
import MASTERCHEF from "../config/build/contracts/MasterChefV2.json"

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

export const mapPendingCobCalls = async (provider) => {
    try {
        const masterChef = new Contract(
            addresses.masterChef,
            MASTERCHEF.abi
        )
    
        const pendingCalls = POOLS.map( pool => 
            masterChef.pendingCob(pool.pid, "0x395977E98105A96328357f847Edc75333015b8f4")
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

export const mapPendingClaimCalls = async (provider) => {
    try {
        const masterChef = new ethers.Contract(
            addresses.masterChef,
            MASTERCHEF.abi,
            provider
        )

        const rewards = await mapPendingCobCalls(provider)

        const filteredPIDS = rewards.map( (reward, index) => {
            if (reward !== '0.0') {
                return index
            }
        })
    
        const pendingCalls = filteredPIDS.map( pid => {
            masterChef.deposit(pid, 0)
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