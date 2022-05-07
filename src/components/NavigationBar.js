import React, {useState} from "react";
import styled from "styled-components";
import {Link, NavLink} from 'react-router-dom';
import {useWeb3React} from "@web3-react/core"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {ConnectButton} from "./ConnectButton"
import {MultiplierBadge} from "../pages/pools/components/Badges"
import DepositModal from "./DepositModal"


import {AiOutlineSwap} from "react-icons/ai"
import {GiCorn, GiHamburgerMenu} from "react-icons/gi"
import {FaGasPump, FaHome, FaTicketAlt, FaHandHoldingWater, FaTwitter, FaDiscord, AiFillGithub, FaGithub} from "react-icons/fa"



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
    
    @media (max-width: 518px) {
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
    
    @media (max-width: 518px) {
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
    align-self: center;
    
`

const DropDown = styled.button`
    display: none;
    

    @media (max-width: 700px) {
  
        width: auto;
      }
    @media (max-width: 518px) {
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
    row-gap: 2em;
    height: 100vh;
    width: 100%; 
    positon: relative;
    z-index: 3;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    place-items: center;
        @media (max-width: 768px) {
        background: linear-gradient(232deg, rgba(22,19,21,1) 17%, rgba(29,30,32,1) 82%) no-repeat !important; 
    }
    // backdrop-filter: blur(12px) saturate(149%);
    // -webkit-backdrop-filter: blur(0px) saturate(149%);
    // background-color: rgba(0, 0, 0, 0.2);
    
`
const MobileMenuRow = styled.div`
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: space-evenly;
    align-content: center;
   
`
const MobileMenuLinkContainer = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 90;
    height: auto;
    width: 80%;
    align-items: space-evenly;
    justify-items: center;
    align-content: center;
    align-self: center;
    margin-bottom: 1.4em;
    padding: 0.8em;
    backdrop-filter: saturate(149%);
    -webkit-backdrop-filter:  saturate(149%);
    background-color: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.125);
    border-radius: 12px;
  
`
const MobileMenuGasContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-items: center;
    align-content: center;
    justify-content: center;
    position: relative;
    z-index: 999;
    width: auto;
    height: auto;
    padding: 0.8em;
    margin-top: 1.4em;
    backdrop-filter: saturate(149%);
    -webkit-backdrop-filter:  saturate(149%);
    background-color: rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.125);
    border-radius: 16px;
`
const MenuLink = styled.a`

    font-size: 1.4em;
    align-self: center;
    text-align: center;
    text-decoration: none;

    &:hover {
        color: #fbdb37;
    }

    &:select {
        color: #fbdb37;
    }

    
`
export const HeaderButtonSecondary = styled.button`
    border-radius: 15px;
    height: auto;
    width: auto;
    background: none;
    border-color: #fce984;
    border-width: 3px;
    color: #FFFFE0;
    font-size: 20px;
    font-weight: 600;
    margin-top: 20px;
    align-self: start;
    margin-right: 15px;
    border-style: solid;

    &:hover {
        background: #fbdb37;
        border-color: #dfbb05;
        border-width: 3px;
        color: #dfbb05;
        font-size: 20px;
        font-weight: 800;
    }

    &:focus {
        background: #fbdb37;
        border-color: #dfbb05;
        border-width: 3px;
        color: #dfbb05;
        font-size: 20px;
        font-weight: 800;
    }
`


const CornIcon = styled(GiCorn)`
    display: none;
    align-self: center;
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
        font-size: 2.1em;
        color: #fbdb37;
        margin-top: 0.35em;
      }
`

//gas button



const GasContainer = styled(LinkContainer)`
    max-width: 11em;
    padding: 0px;
    justify-content: space-between;

`
const MobileGasContainer = styled(GasContainer)`
      display: flex;
      margin-top: 0.9em;
      @media (min-width: 520px) {
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


export const GasForm = () => {
    return (
        <>
           <DepositModal />
        </>
    )
}


const GasTank = (props) => {
    const { data } = useFetchMaticBalance()
    const [toggleGas, setToggleGas] = useState(false)

    const gasToggle = () => {
        setToggleGas( prev => !prev)
    }



    return (
        <>
        <DepositModal showDepositModal={toggleGas} setShowDepositModal={gasToggle} />

        <GasContainer style={props.breakpoint}>
            <GasTextContainer>
                <GasText>{data}</GasText>
                
            </GasTextContainer>
            <GasButtonContainer>
                <GasButton onClick={gasToggle}>
                    <FaGasPump style={{color: "#fbdb37", fontSize: "1.2em"}} />
                </GasButton>
            </GasButtonContainer>

        </GasContainer> 
           
        </>
    )
}

const MobileGasTank = (props) => {
    const { data } = useFetchMaticBalance()
    const [toggleGas, setToggleGas] = useState(false)

    const gasToggle = () => {
        setToggleGas( prev => !prev)
    }



    return (
        <>
        <MobileGasContainer style={props.breakpoint}>
            <GasTextContainer>
                <GasText>{data}</GasText>
                
            </GasTextContainer>
            <GasButtonContainer>
                <GasButton onClick={gasToggle}>
                    <FaGasPump style={{color: "#fbdb37", fontSize: "1.2em"}} />
                </GasButton>
            </GasButtonContainer>
        </MobileGasContainer> 
        <DepositModal showDepositModal={toggleGas} setShowDepositModal={gasToggle} />
           
        </>
    )
}


export const NavigationBar = () => {
    const {active, account, library, connector} = useWeb3React();
    const [toggleNav, setToggleNav] = useState(false)


    const toggle = () => {
        setToggleNav( prev => !prev)
    }

    const goodToast = (msg) => {
        const ToastStyle = {
            borderRadius: "50px",
            backdropFilter: "blur(12px) saturate(149%)",
            backgroundColor: "rgba(29, 30, 32, 0.57)",
            border: "2px solid rgba(251, 219, 55, 0.95)",
            padding: "0.42em",
            
        }

        const id = toast(`${msg}`, {
            position: toast.POSITION.BOTTOM_RIGHT,
            style: ToastStyle
        })
        toast.update(id, { render: `${msg}`, hideProgressBar: true, closeOnClick: true, position: "bottom-right", autoClose: 5000, className: 'rotateY animated', draggable: true})
    }

    const badToast = (msg) => {
        const ToastStyle = {
            borderRadius: "50px",
            backdropFilter: "blur(12px) saturate(149%)",
            backgroundColor: "rgba(29, 30, 32, 0.57)",
            border: "2px solid rgba(251, 219, 55, 0.95)",
            padding: "0.42em",
        }

        const id = toast(`${msg}`, {
            style: ToastStyle,
            position: toast.POSITION.BOTTOM_RIGHT,
        })
        toast.update(id, { render: `${msg}`, closeOnClick: true, hideProgressBar: true, position: "bottom-right", autoClose: 5000, className: 'rotateY animated', draggable: true })
    }

    return (
        <>
        

           



            {toggleNav &&
                
            <NavMenuOverlay>
                <Menu>
                    <MobileMenuRow style={{marginTop: "0.42em"}}>
                        <MobileMenuGasContainer>
                            <CornIcon/>
                            <MobileGasTank />
                        </MobileMenuGasContainer>

                    </MobileMenuRow>

                    <MobileMenuLinkContainer>
                        <MobileMenuRow style={{borderBottom: "1px solid rgba(244, 244, 244, 0.32", margin: "0.4em 0 0.4em 0", justifyContent: "flex-start"}}>
                            <FaHome style={{fontSize: "2.8em", alignSelf: "center", marginRight: "0.8em"}}/>
                            <CleanLink onClick={toggle} to="/">
                                <MenuLink href="#">Home</MenuLink>
                            </CleanLink>
                        </MobileMenuRow>
                        <MobileMenuRow style={{borderBottom: "1px solid rgba(244, 244, 244, 0.32", margin: "0.4em 0 0.4em 0", justifyContent: "flex-start"}}>
                            <FaHandHoldingWater style={{fontSize: "2.8em", alignSelf: "center", marginRight: "0.8em"}} />
                            <CleanLink onClick={toggle} to="/pools">
                                <MenuLink  href="#">Pools</MenuLink>
                            </CleanLink>
                        </MobileMenuRow>
                        <MobileMenuRow style={{borderBottom: "1px solid rgba(244, 244, 244, 0.32", margin: "0.4em 0 0.4em 0", justifyContent: "flex-start"}}>
                            <AiOutlineSwap style={{fontSize: "2.8em", alignSelf: "center", marginRight: "0.8em", marginBottom: "0.1em"}} />
                            <CleanLink onClick={toggle} to="/trade">
                                <MenuLink href="#">Trade</MenuLink>
                            </CleanLink>
                        </MobileMenuRow>
                        <MobileMenuRow style={{margin: "0.4em 0 0.4em 0", justifyContent: "flex-start"}}>
                            <FaTicketAlt style={{fontSize: "2.8em", alignSelf: "center", marginRight: "0.8em"}} />
                            <CleanLink onClick={toggle} to="/collections">
                                <MenuLink href="#">NFTs</MenuLink>
                            </CleanLink>
                        </MobileMenuRow>

                    </MobileMenuLinkContainer>

                    <MobileMenuRow style={{justifyContent: "center"}}>
                    <HeaderButtonSecondary href="https://corn-finance.gitbook.io/corn-finance/" target="_blank">Docs</HeaderButtonSecondary>
                    <HeaderButtonSecondary href="https://twitter.com/PolyCornFi" target="_blank"><FaTwitter/></HeaderButtonSecondary>
                    <HeaderButtonSecondary href="https://github.com/Corn-Fi" target="_blank"><FaGithub /></HeaderButtonSecondary>
                    <HeaderButtonSecondary href="https://discord.gg/MnyauaMDgQ" target="_blank"><FaDiscord /></HeaderButtonSecondary>
                    </MobileMenuRow>
                </Menu>                
            </NavMenuOverlay>
                
            }

            <Nav>
                <NavContainer>

                        <MobileDropDown isOpen={toggleNav} toggle={toggle}/>

                   
                            <CornBadge >
                                <p style={{marginBottom: "0px", fontWeight: "800", fontStyle: "italic"}}>Corn Finance</p>
                            </CornBadge>
                        

                        <LinkContainer>
                            <CornIcon />

                            <CleanLink to="/">
                                <NavbarLink href="#">Home</NavbarLink>
                            </CleanLink>
                            <CleanLink to="/pools">
                                <NavbarLink href="#">Pools</NavbarLink>
                            </CleanLink>
                            <CleanLink to="/trade">
                                <NavbarLink href="#">Trade</NavbarLink>
                            </CleanLink>
                            <CleanLink to="/collections">
                                <NavbarLink href="#">NFTs</NavbarLink>
                            </CleanLink>
                        </LinkContainer>

                
                        <GasTank />
                        <ConnectButton ></ConnectButton>
                </NavContainer>
            </Nav>
            
        </>
    )
}

export default NavigationBar
