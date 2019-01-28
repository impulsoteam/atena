import styled from "styled-components";

const StyledScreenHowItWorks = styled.section`
  .layout {
    padding-top: 0;
    background-color: #fdfdfd;
    color: #666c71;
  }

  .container {
    padding: 100px 15px;
  }

  .about {
    p {
      text-align: left;
    }
  }

  .xprules {
    text-align: center;

    .rules {
      margin: 70px 0;
      background: white;
      height: 100px;
      line-height: 100px;
      font-size: 20px;
      font-weight: bold;
      border-radius: 50px;
      box-shadow: 8px 8px 60px rgba(0, 0, 0, 0.2);
      overflow: hidden;

      .selected {
        background: #595b98;
        color: white;
      }
    }

    .rules__inner {
      text-align: left;
      margin-bottom: 60px;

      p {
        text-align: left;
      }
    }
  }

  .cards {
    p {
      text-align: left;
    }

    button {
      margin-top: 50px;
    }

    img {
      position: absolute;
      top: 30px;
      right: 30px;
    }
  }
`;

export default StyledScreenHowItWorks;
