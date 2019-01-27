import React from "react";
import PropTypes from "prop-types";
import StyledTitle from "./style";

const Title = props => {
  const { children } = props;

  return <StyledTitle>{children}</StyledTitle>;
};

Title.propTypes = {
  children: PropTypes.string.isRequired
};

export default Title;
