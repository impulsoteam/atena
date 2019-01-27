import styled from "styled-components";

const StyledCard = styled.div`
  background-color: ${props => props.theme.color.white};
  color: ${props => props.theme.color.gray};
  text-align: center;
  padding: 60px 60px 80px;
  border-radius: ${props => props.theme.fontSize.medium};
  margin: auto;
  box-shadow: 8px 8px 60px rgba(0, 0, 0, 0.2);
  max-width: 640px;

  h1 {
    color: ${props => props.theme.color.primary};
  }

  .cardIcon {
    background-color: ${props => props.theme.color.white};
    margin: -100px auto 50px;
    display: block;
    padding: 14px;
    width: fit-content;
    border-radius: 100%;
  }

  .cardIcon i {
    font-size: ${props => props.theme.fontSize.super};
    color: ${props => props.theme.color.white};
    background: ${props => props.theme.color.primary};
    border-radius: 100%;
    padding-top: 5px;
    display: block;
    width: 108px;
    height: 109px;
  }
`;

export default StyledCard;
