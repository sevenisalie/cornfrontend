import React from "react";
import styled from "styled-components";
import {Link} from 'react-router-dom';
import {useWeb3React} from "@web3-react/core"

import {ConnectButton} from "./ConnectButton"
import {MultiplierBadge} from "../pages/pools/components/Badges"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {AiFillExclamationCircle, AiFillCheckCircle} from "react-icons/ai"

//bootstrap components
import {Container, Navbar, NavItem} from "react-bootstrap";




const NavContainer = styled(Container)`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    height: auto;

    @media (max-width: 375px) {
        justify-content: space-around;
      }
    
    
`

const Nav = styled(Navbar)`
    
    height: auto;
    width: 100%;
    padding: 5px;
    padding-top: 8px;
    max-width: 100%;
    background-color: transparent !important;
    

`

const ImageWrapper = styled(Container)`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 2px;
    margin-left: 1px;
    height: auto;
    width: auto;
    @media (max-width: 768px) {
        display: none;
      }
    
`
const LogoText = styled.p`
    font-weight: 600;
    font-size: 25px;
    @media (max-width: 768px) {
        display: none;
      }

`

const NavBrandImageWrapper = styled.img`
    height: 100px;
    width: auto;
`

const LinkContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-left: 15px;
    width: auto;
    height: 50px;
    padding: 2px;
    margin-right: 30px;
    border-radius: 20px;
    background-color: #1D1E20;
    justify-content: space-evenly;
    align-items: center;
    box-shadow: 0px 3px 15px rgba(0,0,0,0.2);

    @media (max-width: 375px) {
        margin-left: 5px;
        margin-right: 8px;

      }

    
`

const NavbarLink = styled.a`
    height: auto;
    margin-left: 5px;
    margin-right: 5px;
    font-weight: 400;
    font-size: 1.3em;
    padding-left: 8px;
    padding-right: 8px;
    padding-top: 4px;
    padding-bottom: 4px;
    color: white;
    border-radius: 40px;
    text-decoration: none;

    @media (max-width: 768px) {
        font-size: 0.9em;
        margin-left: 3px;
        margin-right: 3px;
      }

    &:hover {
        padding-left: 8px;
        padding-right: 8px;
        padding-top: 4px;
        padding-bottom: 4px;
        background: #393C3F;
        border-radius: 20px;
        color: white;
    }

`
const CleanLink = styled(Link)`
    text-decoration: none;
`

const NetworkContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: auto;
    height: 45px;
    padding: 2px;
    margin-right: 30px;
    border-radius: 8px;
    background-color: #1D1E20;
    justify-content: space-evenly;
    align-items: center;
    box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
    @media (max-width: 768px) {
        display: none;
      }
`

const NetworkImage = styled.img`
    height: 30px;
    width: auto;
`
const NetworkText = styled.div`
    font-size: 14px;
    font-weight: 600;
    align-self: center;
    margin-right: 4px
`




export const NavigationBar = () => {
    const {active, account, library, connector} = useWeb3React();

    const badToast = (msg) => {
        toast.warning(`${msg}`, {
            position: toast.POSITION.BOTTOM_RIGHT
        })
    }

    return (
        <>
        <ToastContainer></ToastContainer>
            <Nav>
                <NavContainer>
                        <ImageWrapper>
                            <NavBrandImageWrapper src={`/assets/images/CornLogo.png`}></NavBrandImageWrapper>
                            <MultiplierBadge style={{borderRadius: "20px", fontSize: "1.8em", fontWeight: "600"}}>
                                <p style={{marginBottom: "0px", fontWeight: "800", fontStyle: "oblique 10deg"}}>
                                {`Corn Finance`}
                                </p>
                            </MultiplierBadge>
                        </ImageWrapper>
                        <LinkContainer>
                            {/* <CleanLink to="/"> */}
                                <NavbarLink href="#">Home</NavbarLink>
                            {/* </CleanLink> */}
                            {/* <CleanLink to="/vaults"> */}
                                <NavbarLink onClick={() => badToast("Coming Soon")} href="#">Trades</NavbarLink>
                            {/* </CleanLink> */}
                            {/* <CleanLink to="/pools"> */}
                                <NavbarLink onClick={() => badToast("Coming Soon")} href="#">Pools</NavbarLink>
                            {/* </CleanLink> */}
                            {/* <CleanLink disabled to="/nfts"> */}
                                <NavbarLink onClick={() => badToast("Coming Soon")} href="#">Market</NavbarLink>
                            {/* </CleanLink> */}
                        </LinkContainer>
                        <NetworkContainer>
                            {active
                                ? <AiFillCheckCircle style={{color: "green", marginLeft: "5px", marginRight: "5px"}}/>
                                : <AiFillExclamationCircle style={{color: "red", marginLeft: "5px", marginRight: "5px"}}/>
                            }
                            
                            <NetworkText>Polygon</NetworkText>
                        </NetworkContainer>
                        <ConnectButton></ConnectButton>
                </NavContainer>
                
            </Nav>

        </>
    )
}

export default NavigationBar
