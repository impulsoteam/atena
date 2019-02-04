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

  &:hover {
    color: ${props => props.theme.color.secondary};
  }

  &:focus {
    outline: none;
  }
`;

export default StyledButton;
