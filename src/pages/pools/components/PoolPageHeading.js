import React from 'react'
import styled from "styled-components";
import {Container} from "react-bootstrap";
import BackdropFilter from "react-backdrop-filter";
import homebackground from "../../../assets/images/CardBackground.svg"

const HeadingContainer = styled(Container)`
    border-radius: 50px;
    display: flex;
    height: auto;
    width: 100%;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    margin-top: 15px;
    padding: 15px;
    background-image: url(${homebackground});
`

const HeadingBackground = styled.div`

    height: auto;
    width: auto;
    padding: 20px;
    border-radius: 50px;
    background: transparent;

  
    
`

const BigHeading = styled.h1`
    font-size: 280%;
    font-weight: 800;
    color:  #fbdb37;
    
`
const LittleHeading = styled.h2`

    font-size: 200%;
    font-weight: 600;
    color: #fbfbfb;
    
`
const StyledBackDrop = styled.div`
    width: auto;
    border-radius: 50px;
    box-shadow: 20px 20px 30px rgba(0, 0, 0, 0.5)
    backdrop-filter: blur(12px) saturate(187%);
    -webkit-backdrop-filter: blur(12px) saturate(187%);
    background-color: rgba(8, 8, 20, 0.80);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.125);
    border-radius: 24px;
`
const PoolPageHeading = () => {
    return (
        <>
            <HeadingContainer>
                <StyledBackDrop
                    filter={"blur(5px)"}
                    
                    canvasFallback={true}
                    html2canvasOpts={{
                        allowTaint: true
                    }}
                >   
                    <HeadingBackground>  
                        
                
                        <BigHeading>Staking Pools</BigHeading>
                        <LittleHeading>Stake Assets to Earn COB</LittleHeading>
                        
                    </HeadingBackground>
                </StyledBackDrop>
            </HeadingContainer>     
        </>
    )
}

export default PoolPageHeading

