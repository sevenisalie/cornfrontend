import React, {useEffect, useState, useReducer} from 'react'
import { useWeb3React } from "@web3-react/core";
import { ethers } from 'ethers';

//non hook shit
import { getUserTokenBalance } from '../utils/fetchUserData';
import { POOLS } from '../config/pools';
import { ERC20Abi } from '../config/abis';
import { fastRefresh, verySlowRefresh } from "../contexts/RefreshContext"
import useRefresh from '../utils/useRefresh';
import { toFixed } from '../utils/nft';
import { oracleABI } from "../config/abis";
import { addresses } from "../config/addresses";


const getOraclePrice = async (token, _library) => {
    try {
        const signer = _library.getSigner()
        const oracle = new ethers.Contract(addresses.erc20Oracle, oracleABI, signer)
        const rawPrice = await oracle.getRateUSD(token)
        const stringBalance = ethers.utils.formatUnits(rawPrice, 6)
        return stringBalance
    } catch (err) {console.log(err)}
}


const useFetchOraclePrice = (token) => {
    const [balance, setBalance] = useState('Loading...')
    const {active, account, library, connector} = useWeb3React();
    const { verySlowRefresh } = useRefresh()

    useEffect( async () => {
        if (active && library) {
            try {
                const data = await getOraclePrice(token, library)
                setBalance(data)
            } catch (err) {console.log(err)}
        }

    }, [token, verySlowRefresh])

    return {
        data: balance
    }
}

export default useFetchOraclePrice
