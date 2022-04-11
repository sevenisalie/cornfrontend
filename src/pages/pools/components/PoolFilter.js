import React, {useState, useEffect, useReducer} from 'react'
import styled from "styled-components"

const FilterContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 1em;
    margin-bottom: 1em;
    width: 100%;
    height: auto;
    align-content: center;
    align-items: center;
    justify-content: center;
`

const FilterCard = styled.div`
width: 30%;
min-width: 308px;
height: auto;
align-self: center;

backdrop-filter: blur(12px) saturate(149%);
-webkit-backdrop-filter: blur(0px) saturate(149%);
background-color: rgba(29, 30, 32, 0.57);
border: 1px solid rgba(255, 255, 255, 0.125);
box-shadow: 20px 20px 30px rgba(0, 0, 0, 0.5);
`
const FilterCardContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: auto;
    justify-content: space-around;
    align-content: center;
    align-items: center;
`
const FilterButton = styled.button`
    text-align: center;
    text-decoration: none;
    margin-top: 0.4em;
    margin-bottom: 0.4em;
    display: flex;
    flex-wrap: nowrap;
    position: relative;
    z-index: 1;
    will-change: transform;
    transition: transform 450ms ease 0s;
    transform: perspective(1px) translateZ(0px);
    -webkit-box-align: center;
    align-items: center;
    font-size: 24px;
    font-weight: 500;
    backdrop-filter: blur(12px) saturate(149%);
    -webkit-backdrop-filter: blur(0px) saturate(149%);
    background-color: rgba(29, 30, 32, 0.57);
    border: 1px solid rgba(255, 255, 255, 0.125);
    box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;

    color: rgb(255, 255, 255);
    border-radius: 16px;

    outline: none;
    cursor: pointer;
    user-select: none;
    height: 100%;
    width: auto;
    padding: 0px 8px;
    -webkit-box-pack: justify;
    justify-content: space-between;
    margin-right: 3px;


    &:hover {
        background-color: rgb(44, 47, 54);
    }
    &:focus {
        background-color: rgb(33, 35, 40);
    }
`
const PoolFilter = (props) => {

    const apyToggle = () => {
        props.setSortAPY()
    }

    const tvlToggle = () => {
        props.setSortTVL()
    }

    const stakedToggle = () => {
        props.setSortStaked()
    }


    return (
        <>
            <FilterContainer>
                <FilterCard>
                    <FilterCardContainer>
                        <FilterButton onClick={() => apyToggle()}>
                            APY
                        </FilterButton>
                        <FilterButton onClick={() => tvlToggle()}>
                            TVL
                        </FilterButton>

                        <FilterButton onClick={() => stakedToggle()}>
                            STAKED
                        </FilterButton>

                    </FilterCardContainer>
                </FilterCard>
            </FilterContainer>
        </>
    )
}

export default PoolFilter
