import { ethers } from "ethers";
import {useWeb3React} from "@web3-react/core";
import {InjectedConnector} from "@web3-react/injected-connector";

export const injected = new InjectedConnector({
    supportedChainIds: [1, 137],
})

export const TruncateAddress = () => {
    const { active, account, library, connector, activate, deactivate } = useWeb3React();

    let shortAddress = ""
    if (active) {
        shortAddress = account.substring(0,7);
    } else {
        shortAddress = "Connect"
    }
    return shortAddress    
}

export default TruncateAddress