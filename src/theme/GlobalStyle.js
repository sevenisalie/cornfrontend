import { createGlobalStyle } from "styled-components";



export const GlobalStyle = createGlobalStyle`

@import url('https://fonts.googleapis.com/css2?family=Ubuntu&display=swap');

    html, body {
        display: flex;
        flex-direction: column;
        overflow-x: hidden;
        margin: 0 0 0 0;
        padding: 0 0 0 0;
        font-family: 'Ubuntu', sans-serif;
        color: #fbfbfb;
        width: 100vw;
        height: 100vh;
        max-width: 100vw;
        background: rgb(57,60,63);
        background: linear-gradient(232deg, rgba(57,60,63,1) 17%, rgba(29,30,32,1) 82%) no-repeat; 
    }
    a {
        color: #fbfbfb;
    }
`

export default GlobalStyle;