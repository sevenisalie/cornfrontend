import React, {useEffect, useState} from 'react'
import {mapPoolAllowances} from "../utils/multiCall"
import {useWeb3React} from "@web3-react/core"

const useFetchPoolAllowances = (query) => {
    const [allowance, setAllowance] = useState([])
    const {account, library} = useWeb3React()
    const [trigger, setTrigger] = useState(query)

    useEffect(async () => {
        if (account) {
            const data = await mapPoolAllowances(account, library.getSigner())
            console.log("JAMO")
            console.log(data)
            setAllowance(data)
        }

    }, [account, query])

    return [allowance]
}

export default useFetchPoolAllowances
