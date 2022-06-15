import React, {useState, useEffect} from 'react'
import {request, gql} from "graphql-request"

const useGraphQuery = (_query, _endpoint) => {
    const [data, setData] = useState("")
    
    const graphURL = process.env.REACT_APP_GRAPH_URL
    const endpoint = `${graphURL}${_endpoint}`

    const fetchData = async (query) =>  {
        const dataRequest = await request(endpoint, query)
        console.log("TIME")
        console.log(dataRequest)
        console.log("HENSON")
        setData(dataRequest)
    }


    useEffect(() => {
        if (_query !== "") {
            fetchData(_query)
        }
    }, [_query])



    return {
        data: data
    }
}

export default useGraphQuery
