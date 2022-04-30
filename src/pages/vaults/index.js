import React, {useState, useEffect}from 'react'
import styled, { keyframes } from "styled-components"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useWeb3React } from "@web3-react/core";
import {fetchCobTokenInfo} from "../../utils/fetchUserData"

import NavigationBar from "../../components/NavigationBar"
import {Page} from "../../components/Page"
import {BsArrowUpRight} from "react-icons/bs"
import {GiToken} from "react-icons/gi"
import {FaTwitter, FaGithub, FaDiscord} from "react-icons/fa"
import {Card, Container, Button, Dropdown, Form, Placeholder} from "react-bootstrap"
import {HowToSection} from "./components/HowToSection"
import OracleBar from "../../components/OracleBar"
import CobTokenDetails from "./components/CobTokenDetails"
//images
import Gelatologo from "../../assets/images/Gelatologo.svg"
import waves1 from "../../assets/images/waves1.png"
import waves2 from "../../assets/images/waves2.svg"
import waves3 from "../../assets/images/waves3.svg"
import homeufo from "../../assets/images/homeufo.svg"




const HeaderGridContainer = styled(Container)`
    margin-top: 66px;
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto;
    justify-items: center;
    align-content: start;
    column-gap: 2px;
    row-gap: 20px;
    margin-bottom: 25px;

    @media (max-width: 768px) {
        flex-direction: column;
        grid-template-columns: auto;
        grid-template-rows: auto;
        gap: 50px;
    }
    @media (max-width: 375px) {
        flex-direction: column;
        grid-template-columns: auto;
        grid-template-rows: auto;
        gap: 95px;
    }
`
const HeaderContentContainer = styled(Container)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    align-content: center;
    height: auto;
    width: 100%;
`

export const BigHeading = styled.h1`
    font-size: clamp(1rem, 4rem, 4rem);
    font-weight: 800;
    color:  #fbdb37;
    margin-bottom: 24px;
    @media (max-width: 768px) {
        font-size: clamp(1rem, 2.1rem, 3rem);
    }
    
`
export const LittleHeading = styled.h2`
    font-size: 130%;
    font-weight: 600;
    color: #fbfbfb;
    @media (max-width: 768px) {
        font-size: 1.0rem;
    }
    
`
const HeaderImage = styled.object`
    height: 500%;
    width: 100%;
    align-self: start;
    @media (max-width: 768px) {
        height: 250px;
    }
    @media (max-width: 375px) {
        margin-bottom: 90px;
    }
`
const HomeAnimation = keyframes`
    0% {
        transform: translateX(0px) translateY(0px);
    }
    50% {
        transform: translateX(-18px) translateY(-18px);
    }
    100% {
        transform: translateX(0px) translateY(0px);
    }
`

const HomeImage = styled(HeaderImage)`
    animation: ${HomeAnimation} infinite 9s ease-in-out;

`
const BackgroundImage = styled.div`
    aspect-ratio: 960/300;
    width: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    background-image: url('/assets/images/homebackground.svg')
`

const HeaderButton = styled(Button)`
    border-radius: 15px;
    border-style: solid;
    height: 50px;
    width: auto;
    background: #fbdb37;
    border-color: #fce984;
    border-width: 3px;
    color: #FFFFE0;
    font-size: 20px;
    font-weight: 600;
    margin-top: 20px;
    align-self: start;
    margin-right: 15px;

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
export const HeaderButtonSecondary = styled(Button)`
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
const StupidSpan = styled.span`
    align-self: start;
`
const BodyGridContainer = styled(Container)`
    margin-top: 100px;
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: 100%;
    justify-items: center;
    align-content: center;
    column-gap: 2px;
    row-gap: 20px;
    margin-bottom: 25px;

    @media (max-width: 768px) {
        flex-direction: column;
        grid-template-columns: auto;
        grid-template-rows: auto;
        place-items: center;
    }
`
export const BodyContentContainer = styled(Container)`
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    align-content: center;
    margin-bottom: 35px;
`
export const BodyBigHeading = styled(BigHeading)`
    font-weight: 600;
    font-size 190%;
    color: #fbdb37;
    1px 3px 3px rgba(29, 30, 32, 0.88)
`
export const BodyLittleHeading = styled(LittleHeading)`
    font-weight: 400;
    font-size: 120%;
    color: #fbfbfb;
    1px 3px 3px rgba(29, 30, 32, 0.88)
`
export const BodyContentCard = styled(Card)`
    align-self: center;
    height: auto;
    padding: 19px;
    width: 100%;
    backdrop-filter: blur(0px) saturate(149%);
    -webkit-backdrop-filter: blur(0px) saturate(149%);
    background-color: rgba(29, 30, 32, 0.57);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.125);
   
`
export const BodyContentCardContainer = styled(Container)`
    width: 100%
    height: auto;
    padding: 8px;
    justify-content: center;
    align-items: center;
    align-content: center;
    align-self: center;
`
const BodyImageContainer = styled(Container)`
    align-self: center;
    width: auto;
    height: 80%;
`

const SubHeaderGridContainer = styled(BodyGridContainer)`
    margin-top: 100px;
    grid-template-columns: auto auto auto;
`
const SubHeaderContentContainer = styled(Container)`
    display: flex;
    text-align: center;
    flex-direction: column;
    align-items: space-around;
    justify-content: center;
    align-content: center;
    border-left: 2px solid #cdcfd2;
    border-right: 2px solid #cdcfd2;
`
export const BuyButtonSecondary = styled(HeaderButtonSecondary)`
    align-self: center;
`
const TokenSubHeaderGridContainer = styled(SubHeaderGridContainer)`
    margin-top: 100px;
    grid-template-columns: auto;

`
const TokenSubHeaderContentContainer = styled(Container)`
    display: flex;
    text-align: center;
    flex-direction: column;
    align-items: space-around;
    justify-content: center;
    align-content: center;

`
const FooterImage = styled.img`
    width: 60%;
    height: auto;
    
    @media (min-width: 1200px) {
        margin-bottom: 100px;
    }
    
`
const rotateTwo = keyframes`
    from {
        transform: rotate(0deg) translate(0, 0) translate(0, 0);
    }
    to {
        transform: rotate(360deg) translate(7%, 15%) translate(-7%, -15%);
    }
    
`
const rotateThree = keyframes`
    0% {
        transform: translateX(0px) translateY(0px);
    }
    50% {
        transform: translateX(-22px) translateY(-22px);
    }
    100% {
        transform: translateX(0px) translateY(0px);
    }
    
`
const FooterImageTwo = styled.img`
    width: 20%;
    height: auto;
    animation: ${rotateTwo} infinite 10s linear;
    @media (min-width: 1200px) {
        margin-bottom: 100px;
    }
    
`
const FooterImageThree = styled.img`
    width: 20%;
    height: auto;
    animation: ${rotateThree} infinite 9s ease-in-out;
    transform: rotate(180deg);
    @media (min-width: 1200px) {
        margin-bottom: 100px;
    }
`


export const Home = () => {
    const [cobData, setCobData] = useState({Hi: "Hello"})
    const {active, account, library, connector} = useWeb3React();


    useEffect( async () => {
        try {
            if (active && library && account) {
                const tokenData = await fetchCobTokenInfo(
                    active,
                    library.getSigner(),
                    account
                )
                setCobData(tokenData)
                console.log("POOOP")
                console.log(tokenData)
            } else if (!active) {
                setCobData({Hi: "Hello"})
            }
        } catch (err) {console.log(err)}

    }, [active])


    //toastie
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
            <HeaderGridContainer>
                <HeaderContentContainer>
                    <BigHeading>We Need a Bigger Ship Where We're Going. </BigHeading>
                    <LittleHeading>Next Generation DeFi Trading Protocol. Automate ERC20 Trading with Algo-NFTs</LittleHeading>
                    <StupidSpan>
                    <HeaderButtonSecondary href="/trade">Trade <BsArrowUpRight /></HeaderButtonSecondary>
                    <HeaderButtonSecondary href="https://medium.com/@cornfinance" target="_blank" >Learn</HeaderButtonSecondary>
                    </StupidSpan>
                </HeaderContentContainer>
                <HeaderContentContainer style={{alignSelf: "center"}}>
                    <HomeImage type="image/svg+xml" data={homeufo}>svg-animation</HomeImage>
                </HeaderContentContainer>
            </HeaderGridContainer>

            
            
            <CobTokenDetails account={account} token={cobData} />

             
            <div style={{display: "flex", paddingRight: "0px", marginLeft: "0px", marginRight: "0px", marginBottom: "100px", backgroundImage: `url(${waves2})`, backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover", width: "100%", height: "550px"}} >
            <BodyGridContainer >
                <BodyContentContainer>
                    <BodyContentCard>
                        <BodyContentCardContainer>
                            <BodyBigHeading>Accumulation Distribution Model</BodyBigHeading>
                            <hr></hr>
                            <BodyLittleHeading>
                                Our revolutionary smart contract is built on the principals of institutional algorithmic investing. Accumulate tokens at low price targets and Distribute them at higher prices. 
                            </BodyLittleHeading>
                            <BodyLittleHeading style={{color: "#fbdb37", fontWeight: "600"}}>
                                Easy right? 
                            </BodyLittleHeading>
                        </BodyContentCardContainer>
                    </BodyContentCard>
                </BodyContentContainer>
                <BodyContentContainer>
                    <BodyBigHeading style={{color: "#fbdb37", fontWeight: "800", fontSize: "2.8em"}}>We're bringing Algorithmic Trading to DeFi</BodyBigHeading>
                </BodyContentContainer>
            </BodyGridContainer>
            </div>
            
                <BodyContentContainer style={{marginBottom: "200px"}}>
                    <HowToSection>

                    </HowToSection>
                </BodyContentContainer>
        

            <BodyGridContainer>
                <BodyContentContainer>
                    <BodyImageContainer>
                    <FooterImageTwo style={{width: "100%"}} src={`/assets/images/Sircle.svg`}></FooterImageTwo>
                    </BodyImageContainer>
                </BodyContentContainer>

                <BodyContentContainer>
                    <BodyBigHeading style={{fontSize: "310%"}}>Smart Aggregation and Routing</BodyBigHeading>
                    <BodyLittleHeading>Corn routes orders through multiple DEX's to ensure ample liquidity and reduce slippage. Corn's ERC20 router outperforms every individual AMM on the network.</BodyLittleHeading>
                </BodyContentContainer>
            </BodyGridContainer>

            
            <div style={{display: "flex", paddingRight: "0px", marginLeft: "0px", marginRight: "0px", marginBottom: "100px", backgroundImage: `url(${waves1})`, backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover", width: "100%", height: "550px"}} >
            <BodyGridContainer>
                <BodyContentContainer>
                    <BodyLittleHeading style={{color: "#fbdb37", fontWeight: "800", fontSize: "2.8em", textAlign: "center"}}>
                        New Trading Infrastructure for a New DeFi</BodyLittleHeading>
                </BodyContentContainer>
                <BodyContentContainer>
                    <BodyContentCard>
                        <BodyContentCardContainer>
                            <BodyBigHeading>Tons of Strategies</BodyBigHeading>
                            <hr></hr>
                            <BodyLittleHeading>
                                Everything from stop losses to advanced bracket orders based on technical analytics of price.
                            </BodyLittleHeading>
                        </BodyContentCardContainer>
                    </BodyContentCard>
                </BodyContentContainer>
            </BodyGridContainer>
            </div>

            <BodyGridContainer >
                    <BodyContentContainer style={{marginTop: "0px"}}>
                        <BodyImageContainer>
                        <img style={{height: "100%", width: "100%"}} src={Gelatologo}></img>
                        </BodyImageContainer>
                    </BodyContentContainer>

                    <BodyContentContainer>
                        <BodyBigHeading style={{fontSize: "310%"}}>Powered by Gelato</BodyBigHeading>
                        <BodyLittleHeading>We use Gelato's world class smart contract automation solution to trigger order fills. These executors allows for traditionally static vaults to become dynamic, algirothmic trading bots  </BodyLittleHeading>
                    </BodyContentContainer>
            </BodyGridContainer>

            <TokenSubHeaderGridContainer>
                <TokenSubHeaderContentContainer style={{alignSelf: "center"}}>
                    <GiToken style={{alignSelf: "center", color: "#fbdb37", fontSize: "500%", marginBottom: "30px"}}/>
                    <h2 style={{color: "#fbdb37", fontWeight: "600", fontSize: "240%", marginBottom: "50px"}}>100% Fair Launch Governance Token</h2>
                    <BodyContentCard>
                        <BodyContentCardContainer>
                    <p>Stake liquidity to earn COB token.  No pre-sale, no whitelist, just 100% community driven emissions.</p>
                    <hr></hr>
 
                    <p>Not only will COB be useful for the community to drive the development of strategies through governance, but it is also a gas utility token that rewards you in protocol trade fees.</p>
                    <p>Get Paid to Trade.</p>
                    </BodyContentCardContainer>
                    </BodyContentCard>
                    <BuyButtonSecondary href="/pools">Staking Coming Soon<BsArrowUpRight/></BuyButtonSecondary>


                </TokenSubHeaderContentContainer>
            </TokenSubHeaderGridContainer>


        <Container style={{height: "460px", width: "100%", display: "flex", flexDirection: "row", justifyContent: "center", marginTop: "100px", marginBottom: "20px"}}>
        <FooterImage src={'/assets/images/Docs.svg'}></FooterImage> 
        <FooterImageTwo style={{alignSelf: "flex-start"}} src={'/assets/images/Sircle.svg'}></FooterImageTwo>
        <FooterImageThree src={'/assets/images/Sircle.svg'}></FooterImageThree>
        </Container>

        <Container style={{height: "auto", width: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", alignContent: "center", marginTop: "25px", marginBottom: "50px"}}>
        <HeaderButtonSecondary href="https://corn-finance.gitbook.io/corn-finance/" target="_blank">Docs</HeaderButtonSecondary>
                    <HeaderButtonSecondary href="https://twitter.com/PolyCornFi" target="_blank"><FaTwitter/></HeaderButtonSecondary>
                    <HeaderButtonSecondary href="https://github.com/Corn-Fi" target="_blank"><FaGithub /></HeaderButtonSecondary>
                    <HeaderButtonSecondary href="https://discord.gg/MnyauaMDgQ" target="_blank"><FaDiscord /></HeaderButtonSecondary>
        </Container>

        </>
    )
}

export default Home
