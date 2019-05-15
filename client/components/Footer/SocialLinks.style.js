import styled from "styled-components";

const StyledSocialLinks = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  width: fit-content;
  margin: 0 auto;

  li + li {
    margin-left: ${props => props.theme.fontSize.large};
  }

  a {
    color: ${props => props.theme.color.white};
    font-size: ${props => props.theme.fontSize.medium};
    text-decoration: none;
  }

  a:hover {
    color: ${props => props.theme.color.primaryHover};
  }
`;

export default StyledSocialLinks;
