import styled from "styled-components";

const StyledSubTitle = styled.h2`
  font-size: 28px;
  line-height: 1.25;
  font-family: ${props => props.theme.fontFamily.secondary}, serif;
  font-style: italic;
  font-weight: normal;
  margin: 0;
  padding: 0 20px;

  @media (max-width: 760px) {
    font-size: 16px;
  }
`;

export default StyledSubTitle;
