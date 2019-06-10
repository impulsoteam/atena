import styled from 'styled-components'

const StyledTab = styled.div`
  display: flex;
  min-height: 120px;

  .tab__content {
    position: absolute;
    opacity: 0;
    visibility: hidden;
    transition: 0.2s all ease-in;
  }

  a:focus .tab__content {
    opacity: 1;
    visibility: visible;
  }
`

export default StyledTab
