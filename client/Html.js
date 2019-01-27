import React from "react";
import PropTypes from "prop-types";
import { ThemeProvider } from "styled-components";
import Theme from "./styles/theme";

const Html = props => {
  const { children, title, initialData } = props;

  return (
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <title>{title}</title>
      </head>
      <body>
        <ThemeProvider theme={Theme}>
          <div id="app">{children}</div>
        </ThemeProvider>
        <script id="initial-data" type="text/plain" data-json={initialData} />
      </body>
    </html>
  );
};

Html.propTypes = {
  children: PropTypes.element.isRequired,
  title: PropTypes.string,
  initialData: PropTypes.object
};

Html.defaultProps = {
  title: "Atena | Gameficação da Impulso Network"
};

export default Html;
