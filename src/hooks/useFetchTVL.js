import React, {useEffect, useState} from 'react'
import useFetchProvider from "./useFetchProvider"
import axios from 'axios'
import { addresses } from '../config/addresses'
import { POOLS } from "../config/pools"
import MASTERCHEF from "../config/build/contracts/MasterChefV2.json"
import { toFixed } from '../utils/nft'
const useFetchTVL = () => {
    const [provider] = useFetchProvider()
    const [results, setResults] = useState("")
    const [sum, setSum] = useState("")
    const [cobAPY, setCobAPY] = useState("")

    const sumTVL = (_results) => {
        let n = 0;
        _results.forEach(i => {
            const number = parseFloat(i)
            n = n + number
        });

        return n.toString()
    }

    useEffect(() => {
      const fetchPoolData = async () => {
          const rawCall = await axios.get(`https://cornoracleapi.herokuapp.com/poolData`)
          const data = rawCall.data
          const mappedValues = data.POOLS.map( ( pool ) => {
              return pool.poolTVL
          })
          const mappedAPYs = data.POOLS.map( ( pool ) => {
            return pool.APY
          })

          const sum = sumTVL(mappedValues)

          console.log("TRAV")
          console.log(mappedValues)
          console.log(sum)
          setResults(mappedValues)
          setSum(toFixed(sum, 3))
          setCobAPY(toFixed(mappedAPYs[15], 3))
      }

      fetchPoolData()
    
      
    }, [])
    
  return [results, sum, cobAPY]
}

export default useFetchTVL