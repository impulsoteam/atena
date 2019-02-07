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
  children: PropTypes.object.isRequired,
  active: PropTypes.bool,
  left: PropTypes.bool,
  right: PropTypes.bool,
  padding: PropTypes.number
};

Rectangle.defaultProps = {
  active: false,
  left: false,
  right: false,
  padding: 172
};

export default Rectangle;
