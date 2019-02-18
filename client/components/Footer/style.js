import styled from "styled-components";

export const StyledFooter = styled.footer`
  background-color: ${props => props.theme.color.primary};
  color: ${props => props.theme.color.white};
  padding: 50px 0 40px;

  > section {
    max-width: 380px;
    margin: 0 auto;
  }

  .impulsoIcon {
    display: flex;
    margin: 0 auto 40px;
  }
`;

export const StyledCopyright = styled.p`
  text-align: center;
  color: ${props => props.theme.color.primaryLight};
  margin: 0;
`;
