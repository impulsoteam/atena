import styled from 'styled-components'

const StyledHeader = styled.header`
  max-width: ${props => props.theme.gridSize};
  margin: 0 auto;
  padding: 30px 50px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;

  @media (max-width: 760px) {
    padding: 14px 20px;

    img {
      height: 40px;
      display: block;
      margin: auto;
    }
  }
`

export default StyledHeader
