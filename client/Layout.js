import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { ThemeProvider } from "styled-components";
import Theme from "./styles/theme";
import StyledApp from "./styles/global";
import Footer from "./components/Footer";

const Layout = props => {
  const { children } = props;

  return (
    <ThemeProvider theme={Theme}>
      <Fragment>
        <StyledApp />
        {children}
        <Footer />
      </Fragment>
    </ThemeProvider>
  );
};

Layout.propTypes = {
  children: PropTypes.element.isRequired
};

export default Layout;
