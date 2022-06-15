import React, {useEffect, useState} from 'react'
import { writeContract } from '../utils/nft'
import { useWeb3React } from '@web3-react/core';


const useFetchContractWrite = (_ADDRESS, _ABI) => {
    const {active, account, library, connector} = useWeb3React();

    const [query, setQuery] = useState(
        () => {
         return {
         address: _ADDRESS,
         abi: _ABI,
         }
     }
  )
 const [contract, setContract] = useState({})


 useEffect(() => {
     setQuery(
         {
        address: _ADDRESS,
        abi: _ABI,
         }
     )

    
 }, [_ADDRESS, _ABI])

 const fetchContract = async () => {
    try {
    const ctr = await writeContract(
        active,
        library.getSigner(),
        account,
        _ADDRESS,
        _ABI,
        )
    setContract(ctr)
    } catch (err) {console.log(err)}
 }

 useEffect( () => {
    if (active) {

        fetchContract()
       
    } else {
        console.log(query)
        console.log(`fucked up while loading contract`)
    }
}, [active, account, query])

    return [contract, query]
}

export default useFetchContractWrite
