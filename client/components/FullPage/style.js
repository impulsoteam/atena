import styled from "styled-components";

const StyledFullPage = styled.section`
  background: ${props => props.background || props.theme.color.primary};
  background-size: cover;
  background-position: center;
  height: 100vh;
  max-height: 1080px;
  padding: 100px 0;
  text-align: center;
  flex: 1;
  display: flex;
  color: ${props => props.theme.color.white};

  h1,
  h2,
  h3,
  h4,
  h5,
  p {
    max-width: 740px;
  }

  @media (max-width: 760px) {
    height: auto;
    padding: 80px 0;
  }
`;

export default StyledFullPage;
