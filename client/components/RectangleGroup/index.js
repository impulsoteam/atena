import React from "react";
import PropTypes from "prop-types";
import { StyledRectangleGroup } from "./style";

const RectangleGroup = ({ children }) => (
  <StyledRectangleGroup>{children}</StyledRectangleGroup>
);

RectangleGroup.propTypes = {
  children: PropTypes.array.isRequired
};

export default RectangleGroup;
