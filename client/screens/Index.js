import React from "react";
import PropTypes from "prop-types";
import Title from "../components/Title";

const ScreenIndex = props => {
  const { name } = props;

  return <Title>Hello {name}</Title>;
};
ScreenIndex.propTypes = {
  name: PropTypes.string
};

ScreenIndex.defaultProps = {
  name: "Atena"
};

export default ScreenIndex;
