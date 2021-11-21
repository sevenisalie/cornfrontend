import styled from "styled-components";
import {Badge} from "react-bootstrap";


export const MultiplierBadge = styled(Badge)`
    height: auto;
    width: auto;
    font-size: 60%;
    font-weight: 400;
    background-color: transparent !important;
    color: ${props => props.borderColor ? props.borderColor : "#fbdb37"};
    background: none;
    border: 2px solid ${props => props.borderColor ? props.borderColor : "#fbdb37"};
    border-radius: 12px;
    margin: 4px;
    
` 