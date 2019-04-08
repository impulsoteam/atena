import styled from "styled-components";

const StyledButton = styled.button`
  color: ${props => props.theme.color.primary};
  text-transform: uppercase;
  font-weight: bold;
  border-radius: 100px;
  padding: 12px 20px;
  border: 2px solid;
  margin: 20px 0 10px;
  cursor: pointer;
  background-color: transparent;

  & a {
    text-decoration: none;
    color: ${props => props.theme.color.primary};
  }

  &:hover {
    color: ${props => props.theme.color.primary};
    background-color: ${props => props.theme.color.primary};
    & a {
      color: white;
    }
  }

  &:focus {
    outline: none;
    color: ${props => props.theme.color.primaryFocus};
    background-color: ${props => props.theme.color.primaryFocus};
    & a {
      color: white;
    }
  }
`;

export default StyledButton;
