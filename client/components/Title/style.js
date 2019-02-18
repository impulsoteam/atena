import styled from "styled-components";

const StyledTitle = styled.h1`
  font-size: ${props =>
    props.large
      ? props.theme.fontSize.veryLarge
      : props.extralarge
      ? props.theme.fontSize.super
      : props.theme.fontSize.large};
  color: ${props => props.theme.color[props.color || "primary"]};

  ${props =>
    (props.large || props.extralarge) &&
    `
    text-transform: uppercase;
  `}

  ${props =>
    props.extralarge &&
    `
    margin: 0;
    line-height: 1;
  `}

  .red {
    color: ${props => props.theme.color.secondary};
  }

  width: ${props => props.width};
  text-align: ${props => props.align};

  @media (max-width: 760px) {
    font-size: 28px;
  }
`;

export default StyledTitle;
