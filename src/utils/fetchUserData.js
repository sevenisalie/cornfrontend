import React from "react";
import {ethers} from "ethers";
import {writeContract} from "./nft"
import {quickRouterAbi, ERC20Abi} from "../config/abis"
import {addresses} from "../config/addresses"
import BigNumber from "bignumber.js";

const getPoolInfo = async (masterchef, poolLength) => {
    const pLength = poolLength

    const poolInfo = [];
    for (let index = 0; index < pLength; index++) {
        const data = await masterchef.poolInfo(index);
        poolInfo.push(data);
        
    }

    return poolInfo;
} // works

// const checkUserApprovedPool = async (tokendeposit, account, signer, masterchef, erc20abi) => {
//     const erc20 = await fetchContract(tokendeposit, erc20abi, signer);
//     const allowance = await erc20.allowance(account, masterchef.address);
//     const formattedAllowance = ethers.utils.formatUnits(allowance, "ether");
//     console.log(formattedAllowance)
//     if (formattedAllowance !== "0.0") {
//         return true
//     } else {
//         return false
//     }
// }

export const fetchUserPoolData = async (_masterChef, _library, _account, poolLength) => {

    const pLength = poolLength
    const accountAddress = _account;
    const poolInfo = await getPoolInfo(_masterChef, poolLength);
 

    const userPoolDataPromises = [];
    for (let pid = 0; pid < pLength; pid++) {
        const poolData = _masterChef.pendingCob(pid, accountAddress);
        userPoolDataPromises.push(poolData);
    };
    const userPoolBalancesPromises = [];
    for (let pid = 0; pid < pLength; pid++) {
        const userStaked = _masterChef.userInfo(pid, accountAddress)

        userPoolBalancesPromises.push(userStaked);
    };

    const dataPackBalances = await Promise.all(userPoolBalancesPromises)


    const dataPack = Promise.all(userPoolDataPromises)
    .then(values => {
        const data = values.map((value, index) => {
            const pending = ethers.utils.formatUnits(value, "ether");

            const pool = poolInfo[index];
            const lpToken = pool.lpToken;
            const allocationPoints = ethers.utils.formatUnits(pool.allocPoint, "wei");
            const accCobPerShare = ethers.utils.formatUnits(pool.accCobPerShare, "ether");
            const depositFee = pool.depositFeeBP;
            const userStakedBigNum = dataPackBalances[index]
            const userStaked = ethers.utils.formatUnits(userStakedBigNum.amount, 18)
            console.log("USERSTAKED IN M FUNCTION")
            console.log(userStaked)
            
            // const userApproved = fetchPoolAllowance() // fix this dummy
            // pools, _signer, _account, _masterchef

            return {
                pendingReward: pending, 
                poolInformation: {
                    depositTokenAddress: lpToken,
                    allocation: allocationPoints,
                    rewardPerShare: accCobPerShare,
                    fee: depositFee,
                    userStakedBalance: userStaked
                }};
        })
        return data;
    })
    return dataPack
}

export const getPoolLength = async (_masterchef) => {
    _masterchef.poolLength().then( res => {
        return res
    }); 
}

export const mapPendingToOriginalData = (newData, oldData, _masterchef, poolLength) => {
    const staticPoolLength = oldData.length;
    if (poolLength == staticPoolLength) {
        const recycledData = newData.map((value, index) => {
            const pending = value.pendingReward;
            const userStakedAmount = value.poolInformation.userStakedBalance
            
            
            return {
                pendingCob: pending,
                userStaked: userStakedAmount,
                ...oldData[index]
            };
        });

        return recycledData;

    } else {

        console.log(`Devie needs to update static pool folder.  Your fetched pool length is ${poolLength} but your static pool length is ${staticPoolLength}`);
        return oldData;

    }


}

export const getPoolBalance = async (poolData, _active, signer, account, abi, plength) => {


    const balances = poolData.map( async (value, index) => {
        const address = value.tokenStakeAddress
        const erc20 =  await writeContract(_active, signer, account, address, abi)
        const masterChefAddress = "0xC71EbC899BCC111F39B2715B5d2D397E671B5bd2"
        const balance =  await erc20.balanceOf(masterChefAddress)
        const stringbal = ethers.utils.formatUnits(balance, 18)
        
        return stringbal
    });

    const results = await Promise.all(balances)
    return results
}

export const getUserStakedBalance = async (_account, masterChefContract, pid) => {
    const ctr = masterChefContract
    const userInfo = await ctr.userInfo(pid, _account)
    return userInfo
}

export const getUserTokenBalance = async (_active, signer, _account, tokenAddress, abi) => {
    const ctr = await writeContract(_active, signer, _account, tokenAddress, abi)
    const balance = await ctr.balanceOf(_account)
    const _decimals = await ctr.decimals()
    const _symbol = await ctr.symbol()
    const strFormattedBalance = ethers.utils.formatUnits(balance, _decimals)
    const floatFormattedBalance = parseFloat(strFormattedBalance)
    const ret = {
        symbol: _symbol,
        float: floatFormattedBalance,
        string: strFormattedBalance,
        bignum: balance,
        decimals: _decimals
    }
    return ret
}

export const getSwapInfo = async (tokenA, tokenADecimals, tokenB, tokenBDecimals, routerContract) => {
    const ctr = routerContract


    const oneA = ethers.utils.parseUnits("1", tokenADecimals)
    const oneB = ethers.utils.parseUnits("1", tokenBDecimals)
    const _rateAB = await ctr.getAmountsOut(oneA, [tokenA, addresses.tokens.ETH, tokenB])
    const _rateBA = await ctr.getAmountsOut(oneB, [tokenB, addresses.tokens.ETH, tokenA])
    const promises = [_rateAB, _rateBA]

    const [rateAB, rateBA] = await Promise.all(promises)

    const amountBPerOneA = ethers.utils.formatUnits(rateAB[2], tokenBDecimals)
    const amountAPerOneB = ethers.utils.formatUnits(rateBA[2], tokenADecimals)
    return {
        BPerA: amountBPerOneA,
        APerB: amountAPerOneB
    }
}

export const fetchCobTokenInfo = async (_active, signer, _account) => {
    try {
        const cobctr = await writeContract(_active, signer, _account, addresses.tokens.COB, ERC20Abi)
        const usdcctr = await writeContract(_active, signer, _account, addresses.tokens.USDC, ERC20Abi)
    
    
        // const lpctr = await fetchContract(addresses.tokens.lp.COBUSDC, UniPairAbi)
        // const ctr = ctr_read.connect(signer)
        const totalSupply = await cobctr.totalSupply()
        const numTotalSupply = parseFloat(ethers.utils.formatUnits(totalSupply, 18))
    
        const tokenALpBalance = await cobctr.balanceOf(addresses.tokens.lp.COBUSDC)
        const cobLpBalance = parseFloat(ethers.utils.formatUnits(tokenALpBalance, 18))
    
        const tokenBLpBalance = await usdcctr.balanceOf(addresses.tokens.lp.COBUSDC)
        const UsdcLpBalance = parseFloat(ethers.utils.formatUnits(tokenBLpBalance, 6))
    
        const tokenPriceVsQuote = new BigNumber(UsdcLpBalance).div(new BigNumber(cobLpBalance))
        const mc = UsdcLpBalance / cobLpBalance 
    
        BigNumber.config({ EXPONENTIAL_AT: 1e+9 })
       
    
        const data = {
            supply: numTotalSupply,
            marketCap: tokenPriceVsQuote.toPrecision()
    
        }
    
        return data
    } catch (err) {console.log(err)}
    
}




export const fetchPendingCob = async (_pools, _masterChef, _accountAddress) => {    
    const pLength = _pools.length
    const userPoolDataPromises = [];
    for (let pid = 0; pid < pLength; pid++) {
        const poolData = _masterChef.pendingCob(pid, _accountAddress);
        userPoolDataPromises.push(poolData);
    };

    const returns = await Promise.all(userPoolDataPromises)

    const data = returns.map( (d) => {
        const cleaned = ethers.utils.formatUnits(d, 18)
        return cleaned
    })
    return data
}