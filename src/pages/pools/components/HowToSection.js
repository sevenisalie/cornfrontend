import React, {useState, useEffect, useReducer} from 'react'
import styled from "styled-components"
import ethers from "ethers"
import {HeaderButtonSecondary} from "../../vaults"


import useFetchPendingRewards from "../../../hooks/useFetchPendingRewards"
import {useWeb3React} from "@web3-react/core"
import {AiOutlineDeliveredProcedure} from "react-icons/ai"
import {BiCoinStack} from "react-icons/bi"

import {mapPendingClaimCalls, mapPoolAllowances} from "../../../utils/multiCall"

const SectionContainer = styled.div`
    display: flex;
    flex-direction: row;
    height: auto;
    width: 100%;
    justify-content: space-around;
    align-items: center;
    align-content: center;
    padding: 2.5em;
    column-gap: 0.42em;
    @media (max-width: 666px) {
        flex-direction: column;
        row-gap: 0.8em;
    }
`

const HowToCard = styled.div`
    height: 100%;
    width: auto;
    max-width: 50%;
    padding: 1.2em;

    backdrop-filter: blur(13px) saturate(155%);
    -webkit-backdrop-filter: blur(13px) saturate(155%);
    background-color: rgba(22, 22, 22, 0.96);
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.125);

    @media (max-width: 512px) {
        max-width: 80%;
        margin-top: 0.42em;
        margin-bottom: 0.42em;
    }

    @media (max-width: 378px) {
        max-width: 90%;
        margin-top: 0.42em;
        margin-bottom: 0.42em;
    }
`

const InstructionList = styled.ul`

`
const InstructionListItem = styled.li`
    color: rgba(242, 242, 242, 0.99);
    font-size: 0.86em;
`
const InstructionText = styled.div`
    font-size: 0.86em;
    color: rgba(242, 242, 242, 0.99);
    margin-bottom: 0.7em;
    margin-right: 0.4em;
`
const InstructionLink = styled.a`
    text-decoration: none;
    color: default;
    cursor: pointer;
    margin-left: 0.2em;
    font-size: 1.3em;
`

const PoolHeaderText = styled.div`
    font-size: 2em;
    color: rgba(242, 242, 242, 0.90);
    align-self: center;
    margin-left: 1.2em;

    @media (max-width: 712px) {
        font-size: 1.7em;
    }
`

const LineBreak = styled.hr`
    width: 66%;
    height: auto;
    border-top: 0.24em solid;
    color: rgba(242, 242, 242, 0.90);
    margin-left: 30px;
    margin-top: 1.8em;
    margin-bottom: 8em;

    @media (max-width: 712px) {
        width: auto;
        margin-right: 30px;
    }
`
const PendingRewardCard = styled.div`
    padding: 1em;
    height: 100%;
    width: auto;

    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-content: center;
    align-items: center;
    backdrop-filter: blur(13px) saturate(155%);
    -webkit-backdrop-filter: blur(13px) saturate(155%);
    background-color: rgba(22, 22, 22, 0.56);
    border-radius: 14px;
    border: 2px solid rgba(251, 219, 55, 0.825);
`
const RewardContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content; center;
    align-self: center;
`
const RewardText = styled.div`
    font-weight: 600;
    font-size: 0.77em;
    color: #fbdb37;
    align-self: center;
    margin-bottom: 0.82em;
`
const RewardAmountText = styled.div`
    font-weight: 600;
    font-size: 0.95em;
    color: rgba(242, 242, 242, 0.94);
    align-self: center;
`
const ClaimButton = styled(HeaderButtonSecondary)`
    border-color: rgba(251, 219, 55, 0.825);
    align-self: center;
    margin-left: 4.75em;
  
`

const HowToSection = () => {
    const [contract, results, total] = useFetchPendingRewards()
    const {active, account, library, connector} = useWeb3React();


    const claimAll = async () => {
    
        try {
            return await mapPendingClaimCalls(library.getSigner())
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>

       
        <SectionContainer>
        
            <HowToCard>
                <InstructionList>
                    <InstructionText style={{fontSize: "1.1em", color: "#fbdb37"}}>
                        Cool Things to Know:
                    </InstructionText>
                    <InstructionListItem>The world famous MasterChef returns to dish out COB</InstructionListItem>
                        <InstructionListItem>Hitchhiker friendly fees {`👽`} (0.1%)</InstructionListItem>
                        <InstructionListItem>Don't forget to approve the pool first!</InstructionListItem>
                        <InstructionListItem>
                            Dividend pools are separate and can be found above
                            <InstructionLink href="#" target="_blank" >{`👆`}</InstructionLink>
                        </InstructionListItem>
                    </InstructionList>
            </HowToCard>

            <PendingRewardCard>
                <RewardContainer>
                    <RewardText>
                        PENDING REWARDS
                    </RewardText>
                    <RewardAmountText>
                        <BiCoinStack />{`${total}`}
                    </RewardAmountText>
                </RewardContainer>
           
                    <ClaimButton onClick={ async () => await claimAll()}>
                        <AiOutlineDeliveredProcedure style={{marginRight: "0.42em"}} />
                        Claim
                    </ClaimButton>
     
            </PendingRewardCard>
        </SectionContainer>

        <PoolHeaderText>
            Recently Added
        </PoolHeaderText>
        <LineBreak />
            
        </>
    )
}

export default HowToSection
