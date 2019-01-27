import React from "react";
import ReactDOMServer from "react-dom/server";
import Html from "../client/Html";

export const renderScreen = (res, screen, props) => {
  const Component = require(`../client/screens/${screen}`).default;

  return ReactDOMServer.renderToNodeStream(
    <Html initialData={JSON.stringify(props)}>
      <Component {...props} />
    </Html>
  ).pipe(res);
};
