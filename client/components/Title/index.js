import React from "react";
import PropTypes from "prop-types";
import StyledTitle from "./style";

const Title = ({ children, ...others }) => (
  <StyledTitle {...others}>{children}</StyledTitle>
);

Title.propTypes = {
  children: PropTypes.string.isRequired
};

export default Title;
