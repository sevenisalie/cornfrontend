import React from "react";
import styled from "styled-components";
import {Link} from 'react-router-dom';
import {useWeb3React} from "@web3-react/core"

import {ConnectButton} from "./ConnectButton"
import {MultiplierBadge} from "../pages/pools/components/Badges"

import {AiFillExclamationCircle, AiFillCheckCircle} from "react-icons/ai"
import {GiCorn} from "react-icons/gi"
import {FaGasPump} from "react-icons/fa"



//bootstrap components
import {Container, Navbar, NavItem} from "react-bootstrap";
import useFetchMaticBalance from "../hooks/useFetchMaticBalance";




const NavContainer = styled(Container)`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    height: auto;
    padding: 5px;
    @media (max-width: 375px) {
        justify-content: space-around;
        margin-left: none;

      }

      @media (max-width: 768px) {
        justify-content: space-around;
        margin-left: none;
        
      }
    
    
`

const Nav = styled(Navbar)`
    display: flex;
    height: auto;
    width: 100%;
    padding: 3px;
    padding-top: 8px;
    max-width: auto;
    background-color: transparent !important;
    @media (max-width: 375px) {
        padding: 0px;
        margin-left: none;
        max-width: 370px;

      }
      @media (max-width: 768px) {
        padding: 0px;
        margin-left: none;
        max-width: 370px;


      }
    
    
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
    justify-content: space-evenly;
    align-items: center;
    backdrop-filter: blur(12px) saturate(149%);
    -webkit-backdrop-filter: blur(0px) saturate(149%);
    background-color: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.125);
    box-shadow: 20px 20px 30px rgba(0, 0, 0, 0.5)
    
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

        background: #393C3F;
        border-radius: 13px;
        color: white;
        backdrop-filter: blur(12px) saturate(189%);
        -webkit-backdrop-filter: blur(0px) saturate(189%);
        background-color: rgba(255, 255, 255, 0.18);
    }

    &:active {
        padding-left: 8px;
        padding-right: 8px;
        padding-top: 4px;
        padding-bottom: 4px;
        background: #393C3F;
        border-radius: 20px;
        color: white;
        backdrop-filter: blur(12px) saturate(149%);
        -webkit-backdrop-filter: blur(0px) saturate(149%);
        background-color: rgba(0, 0, 0, 0.3);
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
const CornIcon = styled(GiCorn)`
    display: none;
    @media (max-width: 768px) {
        display: flex !important;
        margin-left: 0.1em;
        margin-right: 0.1em;
        font-size: 1.8em;
        color: #fbdb37;


      }

    @media (max-width: 375px) {
        display: flex !important;
        margin-left: 0.3em;
        margin-right: 0.1em;
        font-size: 1.8em;
        color: #fbdb37

      }
`

//gas button



const GasContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 1fr;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
    height: 100%;
    width: auto;
`
const GasTextContainer = styled.div`
    display: flex;
    width: auto;
    height: 100%;
    padding: 0.4em;
    margin-left: 0.4em;
    align-content: center;
    align-items: center;
    justify-content: center;

`
const GasText = styled.p`
    font-size: 0.94em;
    align-self: center;
    margin-bottom: 0px;
    color: #fbfbfb;
    font-weight: 600;
`
const GasButtonContainer = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    align-content: flex-end;
    align-items: flex-end;
    justify-content: flex-end;
`

const GasButton = styled.button`
    width: 4.5em;
    height: 100%;
    border: none;
    padding: 0.4em;
    backdrop-filter: blur(12px) saturate(190%);
    -webkit-backdrop-filter: blur(12px) saturate(190%);
    background-color: rgba(180, 180, 180, 0.17);
    border-radius: 1.09em;
    border: 1px solid rgba(255, 255, 255, 0.125);
    
    &:hover {
        background-color: rgba(180, 180, 180, 0.19);

    }
    `


export const NavigationBar = () => {
    const {active, account, library, connector} = useWeb3React();
    const { data } = useFetchMaticBalance()

    return (
        <>
            <Nav>
                <NavContainer>
                        <ImageWrapper>
                            <MultiplierBadge style={{borderRadius: "20px", fontSize: "1.8em", fontWeight: "600"}}>
                                <p style={{marginBottom: "0px", fontWeight: "800", fontStyle: "oblique 10deg"}}>Corn Finance</p>
                            </MultiplierBadge>
                        </ImageWrapper>


                        <LinkContainer>
                            <CornIcon />

                            <CleanLink to="/">
                                <NavbarLink href="#">Home</NavbarLink>
                            </CleanLink>
                            <CleanLink to="/vaults">
                                <NavbarLink href="#">Vaults</NavbarLink>
                            </CleanLink>
                            <CleanLink to="/pools">
                                <NavbarLink href="#">Pools</NavbarLink>
                            </CleanLink>
                            <CleanLink to="/nfts">
                                <NavbarLink href="#">Trade</NavbarLink>
                            </CleanLink>
                        </LinkContainer>

                        <LinkContainer>
                            <GasContainer>
                                <GasTextContainer>
                                    <GasText>{data}</GasText>
                                   
                                </GasTextContainer>
                                <GasButtonContainer>
                                    <GasButton>
                                        <FaGasPump style={{color: "#fbdb37", fontSize: "1.2em"}} />
                                    </GasButton>
                                </GasButtonContainer>
                            </GasContainer>
                        </LinkContainer>
                        {/* <NetworkContainer>
                            {active
                                ? <AiFillCheckCircle style={{color: "green", marginLeft: "5px", marginRight: "5px"}}/>
                                : <AiFillExclamationCircle style={{color: "red", marginLeft: "5px", marginRight: "5px"}}/>
                            }
                            
                            <NetworkText>Polygon</NetworkText>
                        </NetworkContainer> */}
                        <ConnectButton></ConnectButton>
                </NavContainer>
                
            </Nav>

        </>
    )
}

export default NavigationBar
