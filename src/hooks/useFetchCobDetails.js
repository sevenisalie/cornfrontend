import React, {useState, useEffect} from 'react'
import {CornProvider} from "../utils/nft"
import {Contract, Provider} from "ethers-multicall" //smoke and then write multicall for cob data
import useFetchContractWrite from "./useFetchContractWrite"
import useFetchProvider from "./useFetchProvider"


const useFetchCobDetails = () => {
    const [results, setresults] = useState({})
    const [provider] = useFetchProvider()



    
    return [results]
}

export default useFetchCobDetails
