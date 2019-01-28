import React from "react";
import { renderToNodeStream } from "react-dom/server";
import { ServerStyleSheet, ThemeProvider } from "styled-components";
import Html from "../client/Html";
import Theme from "styles/theme";

export const renderScreen = (res, screen, props) => {
  const Component = require(`../client/screens/${screen}`).default;
  const sheet = new ServerStyleSheet();

  sheet
    .interleaveWithNodeStream(
      renderToNodeStream(
        <Html {...props}>
          <ThemeProvider theme={Theme}>
            <Component {...props} />
          </ThemeProvider>
        </Html>
      )
    )
    .pipe(res);
};
