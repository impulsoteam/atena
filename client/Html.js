import React from "react";
import PropTypes from "prop-types";

const Html = props => {
  const { children, title } = props;

  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="stylesheet" href="https://use.typekit.net/ilk7sdy.css" />
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.6.3/css/brands.css"
          integrity="sha384-1KLgFVb/gHrlDGLFPgMbeedi6tQBLcWvyNUN+YKXbD7ZFbjX6BLpMDf0PJ32XJfX"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.6.3/css/fontawesome.css"
          integrity="sha384-jLuaxTTBR42U2qJ/pm4JRouHkEDHkVqH0T1nyQXn1mZ7Snycpf6Rl25VBNthU4z0"
          crossOrigin="anonymous"
        />
        <title>{title}</title>
      </head>
      <body>{children}</body>
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
