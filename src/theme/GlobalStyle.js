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
    :root {
        --shadow-color: 0deg 0% 0%;
        --shadow-elevation-low:
          0.5px 0.4px 0.7px hsl(var(--shadow-color) / 0.56),
          2px 1.5px 2.8px -2.6px hsl(var(--shadow-color) / 0.54);
        --shadow-elevation-medium:
          0.5px 0.4px 0.7px hsl(var(--shadow-color) / 0.53),
          2.6px 1.9px 3.6px -1.3px hsl(var(--shadow-color) / 0.51),
          10.2px 7.7px 14.2px -2.6px hsl(var(--shadow-color) / 0.5);
        --shadow-elevation-high:
          0.5px 0.4px 0.7px hsl(var(--shadow-color) / 0.49),
          3.9px 2.9px 5.4px -0.5px hsl(var(--shadow-color) / 0.48),
          8.3px 6.2px 11.5px -1px hsl(var(--shadow-color) / 0.48),
          16.2px 12.2px 22.5px -1.6px hsl(var(--shadow-color) / 0.47),
          30px 22.6px 41.7px -2.1px hsl(var(--shadow-color) / 0.46),
          52.3px 39.3px 72.6px -2.6px hsl(var(--shadow-color) / 0.46);
      }
`

export default GlobalStyle;