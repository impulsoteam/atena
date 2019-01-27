import styled from "styled-components";

const StyledMenu = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  width: fit-content;
  margin: 0 auto;

  li + li::before {
    content: "";
    display: inline-block;
    width: 4px;
    height: 4px;
    background: ${props => props.theme.color.secondary};
    border-radius: 3px;
    margin-bottom: 3px;
    margin-left: ${props => props.theme.fontSize.default};
    margin-right: ${props => props.theme.fontSize.default};
  }

  a {
    color: ${props => props.theme.color.white};
    text-transform: uppercase;
    text-decoration: none;
    font-weight: bold;
  }

  a:hover {
    color: ${props => props.theme.color.primaryLight};
  }
`;

export default StyledMenu;
