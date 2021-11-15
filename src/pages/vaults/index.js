import React, {useState, useEffect}from 'react'
import styled from "styled-components"
import NavigationBar from "../../components/NavigationBar"
import {Page} from "../../components/Page"
import {Vault} from "./components/CreateVault"

import {Card, Container, Button, Dropdown, Form} from "react-bootstrap"




export const Home = () => {
 
    return (
        <>
        <Page>
            <Vault></Vault>
        </Page>
        </>
    )
}

export default Home
