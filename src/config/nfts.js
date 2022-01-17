import {addresses} from "./addresses"

import stopcard from "../assets/images/stopcard.png"

export const NFTS = [
    {
        name: "Stop",
        address: addresses.vaults.stopVault,
        commissions: "0.2%",
        image: stopcard,
        id: 1
    },
    {
        name: "Limit",
        address: addresses.vaults.limitVault,
        commissions: "0.2%",
        image: stopcard,
        id: 0
    },
    {
        name: "Accumulator/Distributor",
        address: addresses.vaults.accDistVault,
        commissions: "0.2%",
        image: stopcard,
        id: 2
    },
]