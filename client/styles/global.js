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
    display: block;
    min-height: calc(100vh - 320px);
    padding-top: 100px;
  }

  .container {
    max-width: 980px;
    margin: auto;
    padding: 0 15px;
  }

  .page-index header a.index,
  .page-ranking header a.ranking {
    color: ${props => props.theme.color.primaryLight};

    &::after {
      width: 20px;
    }
  }

  hr {
    border-color: ${props => props.theme.color.primaryLight};
    margin: 40px 0;
  }

  a, input, button {
    transition: .2s all ease-in-out;
  }

  main p {
    font-size: ${props => props.theme.fontSize.medium};
    line-height: 1.5;
    margin: 0;
    text-align: center;
  }

  main p a {
    color: ${props => props.theme.color.primaryLight};
    text-decoration: none;
    font-weight: bold;
  }

  @media (max-width: 760px) {
    main p {
      font-size: 16px;
    }

    .ifdesktop {
      display: none !important;
    }
  }
`;

export default StyledApp;
