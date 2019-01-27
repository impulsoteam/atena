import { createGlobalStyle } from "styled-components";
import styledNormalize from "styled-normalize";

const StyledApp = createGlobalStyle`
  ${styledNormalize}

  html,
  body {
    margin: 0;
    padding: 0;
  }
`;

export default StyledApp;
