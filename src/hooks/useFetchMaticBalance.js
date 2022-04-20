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

const getMaticBalance = async (_account, _library) => {
    try {
        const signer = _library.getSigner()
        const rawBalance = await signer.getBalance()
        const stringBalance = ethers.utils.formatUnits(rawBalance, 18)
        return stringBalance
    } catch (err) {console.log(err)}
}


const useFetchMaticBalance = () => {
    const [balance, setBalance] = useState('Loading...')
    const {active, account, library, connector} = useWeb3React();
    const { verySlowRefresh } = useRefresh()

    useEffect( async () => {
        if (active && library) {
            try {
                const data = await getMaticBalance(account, library)
                setBalance(toFixed(data, 4))
            } catch (err) {console.log(err)}
        }

    }, [account, verySlowRefresh])

    return {
        data: balance
    }
}

export default useFetchMaticBalance
