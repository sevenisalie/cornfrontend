import {ERC20Abi} from "./abis"
import {addresses} from "./addresses"
import ADDRESSES from "../config/build/deployments/map.json"

export const ORDERTYPES = [
    {   
        pid: 0,
        name: "Limit",
        address: ADDRESSES["137"]["Controller"][0],
        tickets: 1,
        image: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    },
    {   
        pid: 1,
        name: "Stop",
        address: ADDRESSES["137"]["Controller"][0],
        tickets: 1,
        image: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    },
    {   
        pid: 2,
        name: "Accumulator Distributor",
        address: ADDRESSES["137"]["Controller"][0],
        tickets: 2,
        image: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    },
    {   
        pid: 3,
        name: "OCO Bracket",
        address: ADDRESSES["137"]["Controller"][0],
        tickets: 2,
        image: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    }
]









//controller.createTrade(0, [wmatic, usdc], [1e15, 0.625e18], [0], '10000 gwei')
