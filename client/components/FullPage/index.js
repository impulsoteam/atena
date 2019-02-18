import React from "react";
import PropTypes from "prop-types";
import StyledFullPage from "./style";

const FullPage = ({ background, children }) => (
  <StyledFullPage background={background}>{children}</StyledFullPage>
);

FullPage.propTypes = {
  background: PropTypes.string,
  children: PropTypes.element.isRequired
};

export default FullPage;
