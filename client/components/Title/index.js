import React from "react";
import PropTypes from "prop-types";
import StyledTitle from "./style";

const Title = ({ children, extraLarge, width, align, ...others }) => (
  <StyledTitle extraLarge={extraLarge} width={width} align={align} {...others}>
    {children}
  </StyledTitle>
);

Title.propTypes = {
  children: PropTypes.array.isRequired,
  extraLarge: PropTypes.bool,
  width: PropTypes.string,
  align: PropTypes.string
};

Title.defaultProps = {
  extraLarge: false,
  width: "auto",
  align: "left"
};

export default Title;
