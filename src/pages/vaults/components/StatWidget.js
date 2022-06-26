import React, {useState, useEffect} from 'react'
import styled from "styled-components"
import {AiOutlineDeliveredProcedure} from "react-icons/ai"
import {Link, NavLink} from 'react-router-dom';


const HeaderButtonSecondary = styled.button`
    border-radius: 15px;
    height: auto;
    width: auto;
    background: none;
    border-color: #fce984;
    border-width: 3px;
    color: #FFFFE0;
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 0 0;
    margin-right: auto;
    margin-left: 0px;

    border-style: solid;

    &:hover {
        background: #fbdb37;
        border-color: #dfbb05;
        border-width: 3px;
        color: #dfbb05;
        font-size: 20px;
     
    }

    &:focus {
        background: #fbdb37;
        border-color: #dfbb05;
        border-width: 3px;
        color: #dfbb05;
        font-size: 20px;
    }
`
const PendingRewardCard = styled.div`
    padding: 1em;
    height: max-content;
    width: max-content;
    min-width: 24em;
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
    padding: 1em;
`
const RewardText = styled.div`
    font-weight: 600;
    font-size: 1.33em;
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
`


const StatWidget = (props) => {
    
    return (
        <>
            <div style={{display: "flex", flexDirection: "column", width: "100%", maxWidth: "24em", height: "auto", justifyContent: "center", alignContent: "center", alignItems: "center"}}>
                <PendingRewardCard>
                    <RewardContainer>
                        <RewardText>
                            {props.header}
                        </RewardText>
                        <RewardAmountText>
                            {props.data}
                        </RewardAmountText>
                    </RewardContainer>
            
                        <Link to={props.action.url}>
                        <ClaimButton >
                            <AiOutlineDeliveredProcedure style={{marginRight: "0.42em"}} />
                            {props.action.name}
                        </ClaimButton>
                        </Link>
     
                </PendingRewardCard>
            </div>
        </>
    )
}

export default StatWidget
