import React from "react";
import PropTypes from "prop-types";
import StyledTitle from "./style";

const Title = ({ children, extraLarge, width, align }) => (
  <StyledTitle extraLarge={extraLarge} width={width} align={align}>
    {children}
  </StyledTitle>
);

Title.propTypes = {
  children: PropTypes.string.isRequired,
  extraLarge: PropTypes.boolean,
  width: PropTypes.string,
  align: PropTypes.string
};

Title.defaultProps = {
  extraLarge: false,
  width: "auto",
  align: "left"
};

export default Title;
