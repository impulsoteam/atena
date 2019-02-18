import React from "react";
import PropTypes from "prop-types";

const Html = props => {
  const { children, title, page } = props;

  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        {/* <link rel="stylesheet" href="https://use.typekit.net/twf3caq.css" /> */}
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.7.1/css/all.css"
          integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr"
          crossOrigin="anonymous"
        />
        <title>{title}</title>
      </head>
      <body className={`page-${page}`}>{children}</body>
    </html>
  );
};

Html.propTypes = {
  children: PropTypes.element.isRequired,
  title: PropTypes.string,
  page: PropTypes.string
};

Html.defaultProps = {
  title: "Atena | Gamificação da Impulso Network"
};

export default Html;
