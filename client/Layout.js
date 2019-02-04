import React, { Fragment } from "react";
import PropTypes from "prop-types";
import StyledApp from "./styles/global";
import Header from "components/Header";
import Footer from "components/Footer";

const Layout = props => {
  const { children, page } = props;

  return (
    <Fragment>
      <StyledApp />
      <Header page={page} />
      <main className="layout">{children}</main>
      <Footer />
    </Fragment>
  );
};

Layout.propTypes = {
  children: PropTypes.element.isRequired,
  page: PropTypes.string
};

export default Layout;
