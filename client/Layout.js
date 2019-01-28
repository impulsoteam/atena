import React, { Fragment } from "react";
import PropTypes from "prop-types";
import StyledApp from "./styles/global";
import Header from "components/Header";
import Footer from "components/Footer";

const Layout = props => {
  const { children } = props;

  return (
    <Fragment>
      <StyledApp />
      <Header />
      <main className="layout">{children}</main>
      <Footer />
    </Fragment>
  );
};

Layout.propTypes = {
  children: PropTypes.element.isRequired
};

export default Layout;
