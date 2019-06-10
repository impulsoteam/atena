import styled from 'styled-components'

const StyledFullPage = styled.section`
  background: ${props => props.background || props.theme.color.primary};
  background-size: cover;
  background-position: center;
  height: ${props => props.height}vh;
  max-height: 1080px;
  padding: 100px 0;
  text-align: center;
  flex: 1;
  display: flex;
  color: ${props => props.theme.color.white};
  opacity: 1;
  background-color: #595b98;

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

  ._overlay {
    background: rgba(39, 62, 84, 0.82);
    overflow: hidden;
    height: 100%;
    z-index: 2;
  }
`

export default StyledFullPage
