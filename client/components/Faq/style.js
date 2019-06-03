import styled from 'styled-components'

const StyledFaq = styled.section`
  button {
    margin-top: 50px;
  }

  @media (max-width: 760px) {
    h1 {
      br {
        display: none;
      }
    }

    i {
      padding-left: 20px;
    }
  }
`

export default StyledFaq
