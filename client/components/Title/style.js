import styled from "styled-components";

const StyledTitle = styled.h1`
  font-size: ${props =>
    props.large ? props.theme.fontSize.veryLarge : (props.extralarge ? "100px" : props.theme.fontSize.large)};
  color: ${props => props.theme.color[props.color || "primary"]};

  ${props =>
    (props.large || props.extralarge) &&
    `
    text-transform: uppercase;
  `}

  .red {
    color: ${props => props.theme.color.secondary};
  }
`;

export default StyledTitle;
