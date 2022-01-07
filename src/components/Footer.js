import React from 'react'
import styled, { keyframes } from "styled-components"
import {Container, Button} from "react-bootstrap"




const FooterImage = styled.svg`
    background-size: cover;
    background-image: url("/assets/images/mountainfooter.svg");
    background-position: bottom;
    background-repeat: no-repeat;
    width: 100%;
    height: auto;
    transform: scaleY(1.8);
    margin-top: 30px;
    
`


export const Footer = () => {
    return (
        <>
     
            <FooterImage></FooterImage>
  
            
        </>
    )
}

export default Footer


