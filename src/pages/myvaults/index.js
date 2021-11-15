import React, {useState, useEffect} from 'react'
import styled from "styled-components";
import {Page} from "../../components/Page"

import {Container, Card} from "react-bootstrap";

const MyVaultContainer = styled(Container)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 12px;
`

const MyVaultCard = styled(Card)`
    padding: 5px;
    border-radius: 7% 7% 7% 7%;
    height: auto;
    width: auto;
    background-color: #1D1E20;
    box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
`

const Vaults = () => {
    return (
        <>
        <Page>
            <MyVaultContainer>
                <MyVaultCard>
                    <h2>Shallom</h2>
                </MyVaultCard>
                <MyVaultCard>
                    <h2>Shabat</h2>
                </MyVaultCard>
                <MyVaultCard>
                    <h2>Ketuviim</h2>
                </MyVaultCard>
            </MyVaultContainer>
        </Page>

        </>
    )
}

export default Vaults
