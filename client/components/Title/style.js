import styled from "styled-components";

const StyledTitle = styled.h1`
  font-size: ${props => props.theme.fontSize.large};
  color: ${props => props.theme.color.primary};
`;

export default StyledTitle;
