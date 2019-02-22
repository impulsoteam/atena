import React from "react";
import PropTypes from "prop-types";
import StyledFullPage from "./style";

const FullPage = ({ background, children, height = "100" }) => (
  <StyledFullPage background={background} height={height}>
    {children}
  </StyledFullPage>
);

FullPage.propTypes = {
  background: PropTypes.string,
  children: PropTypes.element.isRequired,
  height: PropTypes.string.isRequired
};

export default FullPage;
