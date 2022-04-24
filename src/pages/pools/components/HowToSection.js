import React, {useState, useEffect, useReducer} from 'react'
import styled from "styled-components"
import ethers from "ethers"


const SectionContainer = styled.div`
    display: flex;
    flex-direction: row;
    height: auto;
    width: 100%;
    justify-content: space-around;
    align-items: center;
    align-content: center;
    padding: 2.5em;
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

const HowToSection = () => {
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
        </SectionContainer>

        <PoolHeaderText>
            Recently Added
        </PoolHeaderText>
        <LineBreak />
            
        </>
    )
}

export default HowToSection
