import React from "react";
import { renderToNodeStream } from "react-dom/server";
import { ServerStyleSheet } from "styled-components";
import Html from "../client/Html";

export const renderScreen = (res, screen, props) => {
  const Component = require(`../client/screens/${screen}`).default;
  const sheet = new ServerStyleSheet();

  sheet
    .interleaveWithNodeStream(
      renderToNodeStream(
        <Html>
          <Component {...props} />
        </Html>
      )
    )
    .pipe(res);
};
