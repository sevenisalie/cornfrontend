import {Container, Card, Button, Image, Placeholder, Spinner} from "react-bootstrap";
import styled from "styled-components";
import {ethers} from "ethers";
import React, {useEffect, useState} from "react";
import { Link } from 'react-router-dom'
import { useWeb3React } from "@web3-react/core";
import axios from "axios"
import {MultiplierBadge} from "./Badges"


const LoadingSpinner = () => {
    return (
        <>
            <MultiplierBadge style={{padding: "6px", alignSelf: "center", borderRadius: "100%" }}>
                <Spinner animation="grow" variant="warning" />
            </MultiplierBadge>
            
        </>
    )
}

export default LoadingSpinner
