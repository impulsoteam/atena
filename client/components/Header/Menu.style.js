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

  li {
    &:not(:first-child) a::after {
      transform: translateY(6px) translateX(32px);
    }
  }

  a {
    color: ${props => props.theme.color.white};
    text-transform: uppercase;
    text-decoration: none;
    font-weight: bold;

    &::after {
      content: "";
      display: block;
      width: 0px;
      height: 3px;
      background: ${props => props.theme.color.primaryLight};
      border-radius: 3px;
      position: absolute;
      transform: translateY(6px);
      transition: 0.2s all ease-in;
    }

    &.selected::after {
      width: 20px;
    }

    &:hover {
      color: ${props => props.theme.color.primaryLight};

      &::after {
        width: 20px;
      }
    }
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

      &::after {
        display: none;
      }
    }
  }
`;

export default StyledMenu;
