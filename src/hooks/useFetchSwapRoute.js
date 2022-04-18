import React, { useState, useEffect} from 'react'
import axios from "axios"

const useFetchSwapRoute = (_tokenA, _tokenB, _amountIn) => {
    const [query, setQuery] = useState(
           () => {
            return {
            tokenA: _tokenA,
            tokenB: _tokenB,
            amountIn: _amountIn
            }
        }
     )
    const [results, setResults] = useState({})


    useEffect(() => {
        setQuery(
            {
            tokenA: _tokenA,
            tokenB: _tokenB,
            amountIn: _amountIn
            }
        )

       
    }, [_tokenA, _tokenB, _amountIn])


    useEffect( () => {
        const fetchRequest = async (_query) => {
            const url = `https://cornoracleapi.herokuapp.com/routerInfo/?tokenA=${_query.tokenA.address}&tokenB=${_query.tokenB.address}&amount=${_query.amountIn}`
            const request = await axios.get(url)
            const data = request.data
            setResults(
                data
            )
        }

        if (query.tokenA !== "" && query.tokenB !== "" && query.amountIn !== "") {
            fetchRequest(query)
        }
    }, [query, _tokenA, _tokenB, _amountIn])

    return [results, query]
}

export default useFetchSwapRoute
