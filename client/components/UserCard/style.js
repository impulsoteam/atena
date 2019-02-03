import styled from "styled-components";

export const StyledUserCard = styled.div`
  background-color: ${props => props.theme.color.white};
  max-height: 413px;
  width: ${props => props.width};
  margin-right: 8px;
  box-shadow: 8px 8px 60px 0px rgba(0, 0, 0, 0.08);
  margin-top: ${props => !props.first && "70px"};
  border-radius: 10px;
`;

export const StyledContainer = styled.div`
  background-color: #fff;
  height: 413px;
  border-radius: 10px;
  figure {
    margin-top: 0;
    background-color: #6567a9;
    padding-top: 30px;
    display: flex;
    width: 232px;
    align-items: center;
    justify-content: center;
    border-bottom-right-radius: 50%;
    border-bottom-left-radius: 50%;
  }

  img {
    width: 216px;
    height: 216px;
    border-radius: 50%;
    padding: 0 5px 8px 5px;
  }
`;

export const StyledPosition = styled.div`
  background-color: #fff;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border-width: 5px;
  border-style: solid;
  border-color: #6567a9;
  display: flex;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  justify-content: center;
  align-items: center;
  position: relative;
  margin: -50px auto;
  z-index: 99999;
`;

export const StyledInfo = styled.div`
  margin-top: 70px;

  h1 {
    text-align: center;
    text-transform: uppercase;
    font-size: 20px;
    color: #595b98;
  }
`;

export const StyledPoint = styled.div`
  flex: 1;
  flex-direction: column;
  text-align: center;
  border-right: ${props => (props.border ? "solid 1px #e2e2e2" : "none")};
  p {
    text-transform: uppercase;
    font-size: 16px;
    color: #666c71;
    font-weight: bold;
    padding: 6px;
    margin: 0;
  }
`;

export default StyledUserCard;
