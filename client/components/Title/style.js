import styled from "styled-components";

const StyledTitle = styled.h1`
  font-size: ${props =>
    props.extraLarge
      ? props.theme.fontSize.extraLarge
      : props.theme.fontSize.large};
  text-transform: uppercase;
  width: ${props => props.width};
  text-align: ${props => props.align};
`;

export default StyledTitle;
