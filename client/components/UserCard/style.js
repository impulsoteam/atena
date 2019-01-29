import styled from "styled-components";

const StyledUserCard = styled.div`
  background-color: ${props => props.theme.color.white};
  min-height: 413px;
  width: ${props => props.width};
`;

export default StyledUserCard;
