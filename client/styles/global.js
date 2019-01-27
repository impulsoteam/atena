import { createGlobalStyle } from "styled-components";
import styledNormalize from "styled-normalize";

const StyledApp = createGlobalStyle`
  ${styledNormalize}

  @import url("https://use.typekit.net/ilk7sdy.css");

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
  }

  hr {
    border-color: ${props => props.theme.color.primaryLight};
    margin: 40px 0;
  }

  a, input, button {
    transition: .2s all ease-in-out;
  }
`;

export default StyledApp;
