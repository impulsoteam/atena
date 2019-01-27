import { createGlobalStyle } from "styled-components";
import styledNormalize from "styled-normalize";

const StyledApp = createGlobalStyle`
  ${styledNormalize}

  @import url("https://use.typekit.net/ilk7sdy.css");

  html,
  body {
    margin: 0;
    padding: 0;
    font-family: "proxima-nova";
  }
`;

export default StyledApp;
