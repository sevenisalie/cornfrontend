import React from "react";
import {ethers} from "ethers";
import {writeContract} from "./nft"

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

    const dataPack = Promise.all(userPoolDataPromises)
    .then(values => {
        const data = values.map((value, index) => {
            const pending = ethers.utils.formatUnits(value, "ether");

            const pool = poolInfo[index];
            const lpToken = pool.lpToken;
            const allocationPoints = ethers.utils.formatUnits(pool.allocPoint, "wei");
            const accCobPerShare = ethers.utils.formatUnits(pool.accCobPerShare, "ether");
            const depositFee = pool.depositFeeBP;
            // const userApproved = fetchPoolAllowance() // fix this dummy
            // pools, _signer, _account, _masterchef

            return {
                pendingReward: pending, 
                poolInformation: {
                    depositTokenAddress: lpToken,
                    allocation: allocationPoints,
                    rewardPerShare: accCobPerShare,
                    fee: depositFee
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
            return {
                pendingCob: pending,
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
        const stringbal = ethers.utils.formatUnits(balance, "ether")
        
        return stringbal
    });

    const results = await Promise.all(balances)
    return results
}

