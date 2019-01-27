import { createGlobalStyle } from "styled-components";
import styledNormalize from "styled-normalize";

const StyledApp = createGlobalStyle`
  ${styledNormalize}

  *, *::before, *::after {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    font-family: "proxima-nova", sans-serif;
    font-size: ${props => props.theme.fontSize.default};
    background-color: ${props => props.theme.color.primary};
    color: ${props => props.theme.color.white}
  }

  .layout {
    display: flex;
    min-height: calc(100vh - 320px);
    padding-top: 100px;
  }

  hr {
    border-color: ${props => props.theme.color.primaryLight};
    margin: 40px 0;
  }

  a, input, button {
    transition: .2s all ease-in-out;
  }

  p.super {
    font-size: ${props => props.theme.fontSize.medium};
    line-height: 30px;
    margin: 0;
    text-align: center;
  }

  p.super a {
    color: ${props => props.theme.color.primaryLight};
    text-decoration: none;
    font-weight: bold;
  }

  @media (max-width: 760px) {
    main {
      padding: 0 12px;
    }
  }
`;

export default StyledApp;
