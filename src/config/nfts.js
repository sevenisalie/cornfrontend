import {addresses} from "./addresses"
import {ethers} from "ethers"

export const NFTS = [
    {
        name: "Popcorn Puke",
        address: addresses.nfts[0].address,
        fee: ethers.utils.parseUnits("100", 16),
        price: "1.00",
        imageurl: `assets/images/PopCornPuke.png`,
        id: 0
    },
    {
        name: "I Want to Believe ",
        address: addresses.nfts[1].address,
        fee: ethers.utils.parseUnits("100", 16),
        price: "1.00",
        imageurl: `assets/images/IWantToBelieve.png`,
        id: 1
    },
    {
        name: "Enjoy the Show",
        address: addresses.nfts[2].address,
        fee: ethers.utils.parseUnits("100", 16),
        price: "1.00",
        imageurl: `assets/images/EnjoyTheShow.png`,
        id: 2
    },
]

export default NFTS