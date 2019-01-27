import React from "react";
import PropTypes from "prop-types";

const Html = props => {
  const { children, title } = props;

  return (
    <html>
      <head>
        <meta charset="UTF-8" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <title>{title}</title>
      </head>
      <body>
        <main id="app">{children}</main>
      </body>
    </html>
  );
};

Html.propTypes = {
  children: PropTypes.element.isRequired,
  title: PropTypes.string
};

Html.defaultProps = {
  title: "Atena | Gameficação da Impulso Network"
};

export default Html;
