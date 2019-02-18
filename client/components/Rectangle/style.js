import styled from "styled-components";

export const StyledRectangle = styled.div`
  background: ${props =>
    props.active ? props.theme.color.primary : props.theme.color.white};
  font-size: ${props => props.theme.spacing.unit * 2.5}px;
  text-align: center;
  max-height: 100px;
  padding: 40px 0;
  flex: 1;
  a {
    display: inline-block;
    text-decoration: none;
    color: ${props =>
      props.active ? props.theme.color.white : props.theme.color.gray};
    font-weight: 600;
  }
  a:after {
    background: none repeat scroll 0 0 #fff;
    content: "";
    display: block;
    height: ${props => props.theme.spacing.unit * 0.25}px;
    position: relative;
    width: ${props => props.theme.spacing.unit * 3.75}px;
  }
`;

export const LeftStyledRectangle = styled(StyledRectangle)`
  border-top-left-radius: 100px;
  border-bottom-left-radius: 100px;
`;

export const RightStyleRectangle = styled(StyledRectangle)`
  border-top-right-radius: 100px;
  border-bottom-right-radius: 100px;
`;

export default StyledRectangle;
