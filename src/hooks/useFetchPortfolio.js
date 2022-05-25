import React, {useState, useEffect} from 'react'

import {vaultTokensByOwner} from "../utils/portfolio"
import useFetchContractWrite from "./useFetchContractWrite"
import { useWeb3React } from "@web3-react/core";

const useFetchPortfolio = (_address) => {
    const [data, setData] = useState('')
    const {account, library} = useWeb3React()

    useEffect(() => {

        const fetchData = async () => {
            try {
                response = await vaultTokensByOwner(account, library.getSigner())
                setData(response)
            } catch (err) {
       
                setData({
                    error: err
                })
            }
        }

        if (account) {
            fetchData()
        }

    }, [account, _address])
    

  return {
      data
  } 
}

export default useFetchPortfolio