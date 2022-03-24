import React, {useState} from "react";
import styled from "styled-components";
import {Link, NavLink} from 'react-router-dom';
import {useWeb3React} from "@web3-react/core"

import {ConnectButton} from "./ConnectButton"
import {MultiplierBadge} from "../pages/pools/components/Badges"
import DepositModal from "./DepositModal"

import {AiFillExclamationCircle, AiFillCheckCircle} from "react-icons/ai"
import {GiCorn, GiHamburgerMenu} from "react-icons/gi"
import {FaGasPump} from "react-icons/fa"



//bootstrap components
import {Container, Navbar, NavItem} from "react-bootstrap";
import useFetchMaticBalance from "../hooks/useFetchMaticBalance";




const NavContainer = styled.div`
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

const Nav = styled.div`
    display: flex;
    height: auto;
    width: 100%;
    padding: 3px;
    padding-top: 8px;
    max-width: auto;
    position: relative;
    z-index: 1;
    background-color: transparent !important;
    @media (max-width: 375px) {
        padding: 0px;
        margin-left: none;
   

      }
      @media (max-width: 768px) {
        padding: 0px;
        margin-left: none;
        


      }
    
    
`
const CornBadge = styled(MultiplierBadge)`
      font-size: 1.2em;
      border-radius: 19px;
      @media (max-width: 768px) {
        display: none;
      }
    
    @media (max-width: 405px) {
        display: flex;
        margin-left: 0px;

    }
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
    align-self: center;
    justify-content: space-evenly;
    align-items: center;
    backdrop-filter: blur(12px) saturate(149%);
    -webkit-backdrop-filter: blur(0px) saturate(149%);
    background-color: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.125);
    box-shadow:
    1.4px 4.2px 8.2px -50px rgba(0, 0, 0, 0.032),
    4.7px 14.1px 27.7px -50px rgba(0, 0, 0, 0.048),
    21px 63px 124px -50px rgba(0, 0, 0, 0.08);
    
    @media (max-width: 405px) {
        display: none;
      }
      @media (max-width: 700px) {
        margin-left: 5px;
        margin-right: 8px;
        width: auto;
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

    @media (max-width: 1080px) {
        font-size: 0.9em;
        margin-left: 3px;
        margin-right: 3px;
      }

    @media (max-width: 768px) {
        font-size: 0.9em;
        margin-left: 3px;
        margin-right: 3px;
      }
    @media (max-width: 380px) {
        font-size: 0.6em;
        font-weight: 800;
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

const DropDown = styled.button`
    display: none;
    

    @media (max-width: 700px) {
  
        width: auto;
      }
    @media (max-width: 405px) {
        display: flex !important;
 
        padding: 0.42em;
        flex-direction: row;
        width: auto;
        height: 100%;
    
        border-radius: 19px;
        align-self: flex-start;
        justify-content: space-evenly;
        align-items: center;
        backdrop-filter: blur(12px) saturate(149%);
        -webkit-backdrop-filter: blur(0px) saturate(149%);
        background-color: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.125);
        box-shadow:
        1.4px 4.2px 8.2px -50px rgba(0, 0, 0, 0.032),
        4.7px 14.1px 27.7px -50px rgba(0, 0, 0, 0.048),
        21px 63px 124px -50px rgba(0, 0, 0, 0.08);
    }
`
const HamburgerSymbol = styled(GiHamburgerMenu)`
    height: 70%;
    width: auto;
    justify-self: center;
    margin-bottom: 0px;
    padding-bottom: 0px;
    color: #fbdb37;
`
const NavMenuOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .5);
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
`
const Menu = styled.div`
    display: flex;
    flex-direction: column;
    padding-top: 2em;
    height: 100vh;
    width: 100%; 
    positon: relative;
    z-index: 3;
    justify-content: space-evenly;
    align-items: center;
    align-content: center;
    place-items: center;
    backdrop-filter: blur(12px) saturate(149%);
    -webkit-backdrop-filter: blur(0px) saturate(149%);
    background-color: rgba(0, 0, 0, 0.2);
    
`
const MenuLink = styled.a`

    font-size: 4.2em;
    width: 100%;
    height: auto;
    text-align: center;
    text-decoration: none;

    &:hover {
        color: #fbdb37;
    }

    &:select {
        color: #fbdb37;
    }

    
`


const CornIcon = styled(GiCorn)`
    display: none;
    @media (max-width: 768px) {
        display: block !important;
        margin-left: 0.1em;
        margin-right: 0.1em;
        font-size: 1.8em;
        color: #fbdb37;

      }

    @media (max-width: 375px) {
        display: block !important;
        margin-left: 0.3em;
        margin-right: 0.1em;
        font-size: 1.8em;
        color: #fbdb37;

      }
`

//gas button



const GasContainer = styled(LinkContainer)`
    max-width: 11em;

    padding: 0px;
    justify-content: space-between;
    @media (max-width: 690px) {
        display: none;

      }
`
const GasTextContainer = styled.div`
    display: flex;
    width: 100%;
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


export const MobileDropDown = (props) => {
    return (
        <>
           <DropDown onClick={props.toggle}>  
                {props.isOpen ?
                <HamburgerSymbol/>
                :
                <HamburgerSymbol style={{color: "#fbfbfb"}}/>
                }
            </DropDown>
        
        </>
    )
}

const ModalCard = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0;
    border-radius: 12px;
    position: relative;
    max-width: 480px;
    height: auto;
    width: 100%;
    backdrop-filter: blur(12px) saturate(189%);
    -webkit-backdrop-filter: blur(12px) saturate(189%);
    background-color: rgba(29, 30, 32, 0.88);
    border: 1px solid rgba(255, 255, 255, 0.225);
    box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;
    border-radius: 24px;
    margin-top: 1rem;
`
export const GasForm = () => {
    return (
        <>
           <DepositModal />
        </>
    )
}


export const NavigationBar = () => {
    const {active, account, library, connector} = useWeb3React();
    const { data } = useFetchMaticBalance()
    const [toggleNav, setToggleNav] = useState(false)
    const [toggleGas, setToggleGas] = useState(false)


    const toggle = () => {
        setToggleNav( prev => !prev)
    }

    const gasToggle = () => {
        setToggleGas( prev => !prev)
    }

    return (
        <>

           



            {toggleNav &&
                
            <NavMenuOverlay>
                <Menu>
                <CornIcon/>
                    <CleanLink onClick={toggle} to="/">
                        <MenuLink href="#">Home</MenuLink>
                    </CleanLink>
                    <CleanLink onClick={toggle} to="/vaults">
                        <MenuLink href="#">Vaults</MenuLink>
                    </CleanLink>
                    <CleanLink onClick={toggle} to="/pools">
                        <MenuLink href="#">Pools</MenuLink>
                    </CleanLink>
                    <CleanLink onClick={toggle} to="/nfts">
                        <MenuLink href="#">Trade</MenuLink>
                    </CleanLink>
                </Menu>                
            </NavMenuOverlay>
                
            }

            <Nav>
                <NavContainer>

                        <MobileDropDown isOpen={toggleNav} toggle={toggle}/>

                   
                            <CornBadge >
                                <p style={{marginBottom: "0px", fontWeight: "800", fontStyle: "oblique 10deg"}}>Corn Finance</p>
                            </CornBadge>
                        

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

                
                            <GasContainer>
                                <GasTextContainer>
                                    <GasText>{data}</GasText>
                                   
                                </GasTextContainer>
                                <GasButtonContainer>
                                    <GasButton onClick={gasToggle}>
                                        <FaGasPump style={{color: "#fbdb37", fontSize: "1.2em"}} />
                                    </GasButton>
                                </GasButtonContainer>
                            </GasContainer>
                     
                        <ConnectButton ></ConnectButton>
                </NavContainer>
            </Nav>
            
            <DepositModal showDepositModal={toggleGas} setShowDepositModal={gasToggle} />
        </>
    )
}

export default NavigationBar
