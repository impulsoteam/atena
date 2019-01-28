import React from "react";
import PropTypes from "prop-types";
import {
  StyledRectangle,
  LeftStyledRectangle,
  RightStyleRectangle
} from "./style";

const Rectangle = ({ children, active, left, right, padding }) => {
  if (right)
    return (
      <RightStyleRectangle active={active} padding={padding}>
        {children}
      </RightStyleRectangle>
    );
  if (left)
    return (
      <LeftStyledRectangle active={active} padding={padding}>
        {children}
      </LeftStyledRectangle>
    );
  return (
    <StyledRectangle active={active} padding={padding}>
      {children}
    </StyledRectangle>
  );
};

Rectangle.propTypes = {
  children: PropTypes.string.isRequired,
  active: PropTypes.boolean,
  left: PropTypes.boolean,
  right: PropTypes.boolean,
  padding: PropTypes.number
};

Rectangle.defaultProps = {
  active: false,
  left: false,
  right: false,
  padding: props => props.theme.spacing.unit * 21.5
};

export default Rectangle;
