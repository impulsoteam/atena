import styled from "styled-components";

export const StyledRectangleGroup = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${props => props.theme.spacing.unit * 12.5}px;
  margin-bottom: ${props => props.theme.spacing.unit * 12.5}px;
`;

export default StyledRectangleGroup;
