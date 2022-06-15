import { ethers } from "ethers"
import * as tokens from "../config/TOKENLIST.json"

export const tokenData = (_token) => {
    const token = ethers.utils.getAddress(_token)
    const data = tokens.tokens.find(t => t.address === token)
    console.log("bobby", data)
    return data
}