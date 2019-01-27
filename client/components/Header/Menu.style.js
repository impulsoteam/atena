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

  @media (max-width: 760px) {
    position: fixed;
    z-index: 900;
    background: ${props => props.theme.color.primary};
    top: 0;
    bottom: 0;
    left: 0;
    flex-direction: column;
    padding: 30px;
    transform: translateX(-100%);

    li + li::before {
      display: none;
    }

    a {
      padding: ${props => props.theme.fontSize.default};
      display: block;
    }
  }
`;

export default StyledMenu;
