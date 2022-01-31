import {ERC20Abi} from "./abis"
import {addresses} from "./addresses"

export const ORDERTYPES = [
    {   
        pid: 0,
        name: "Limit",
        address: addresses.vaults.limitVault,
        tickets: 1,
        image: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    },
    {   
        pid: 1,
        name: "Stop",
        address: addresses.vaults.stopVault,
        tickets: 1,
        image: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    },
    {   
        pid: 2,
        name: "Accumulator Distributor",
        address: addresses.vaults.accDistVault,
        tickets: 2,
        image: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    }
]