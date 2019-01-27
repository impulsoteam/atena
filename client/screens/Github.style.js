import styled from "styled-components";

const StyledScreenGithub = styled.section`
  main {
    padding-top: 250px;
    padding-bottom: 100px;
  }

  ._inner {
    flex: 1;
  }

  ._inner > p {
    margin-top: 60px;
  }

  @media (max-width: 760px) {
    main {
      padding-top: 160px;
      padding-bottom: 60px;
    }

    ._inner > p {
      margin-top: 30px;
    }
  }
`;

export default StyledScreenGithub;
