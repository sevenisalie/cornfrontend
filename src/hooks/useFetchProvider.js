import React, {useState, useEffect} from 'react'
import {CornProvider} from "../utils/nft"

const useFetchProvider = () => {
    const [provider, setProvider] = useState("")
    const [retry, setRetry] = useState(false)

    useEffect(() => {
        const fetchProvider = async () => {
            try {
                const prov = await CornProvider()
                return setProvider(prov)
            } catch (err) {
                console.log(err)
                setRetry(true)
            }
        }

        fetchProvider()
    }, [retry])



    return [provider]
}

export default useFetchProvider
