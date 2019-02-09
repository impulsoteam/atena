import styled from "styled-components";

const StyledScreenHowItWorks = styled.section`
  .layout {
    padding-top: 0;
    background-color: #fdfdfd;
    color: #666c71;
    padding-bottom: 80px;
  }

  .container {
    padding: 100px 15px;
  }

  .about {
    position: relative;
    z-index: 10;

    img {
      @media (max-width: 760px) {
        transform: scale(0.8);
      }
    }

    &::before {
      content: url("./images/lines.png");
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      margin: auto;
      z-index: -1;
      opacity: 0.6;
      width: 90vw;
      left: 50%;
      transform: translateX(-50%);
      max-width: 1280px;
    }
    p {
      text-align: left;
    }
  }

  .xprules {
    text-align: center;
    position: relative;
    z-index: 10;

    &::before {
      content: url("./images/shape.svg");
      display: block;
      position: absolute;
      transform: translateY(-50%) translateX(75%);
      z-index: -1;
      right: 0;
    }

    .rules {
      margin: 70px 0 80px;
      background: white;
      height: 100px;
      font-size: 20px;
      font-weight: bold;
      border-radius: 50px;
      box-shadow: 8px 8px 60px rgba(0, 0, 0, 0.2);
      overflow: hidden;

      a {
        display: flex;
        align-items: center;
        height: 100px;
        justify-content: center;
        padding: 0 30px;
        text-decoration: none;
        color: #595b98;

        span::after {
          content: "";
          display: block;
          width: 0px;
          height: 3px;
          background: #c9ced2;
          border-radius: 3px;
          position: absolute;
          transform: translateY(6px);
          transition: 0.2s all ease-in;
        }

        &:hover {
          span::after {
            width: 30px;
            background: #595b98;
          }
        }

        &.selected {
          background: #595b98;
          color: white;

          span::after {
            width: 30px;
            background: #ffffff;
          }
        }
      }
    }

    .rules__inner {
      text-align: left;
      margin-bottom: 60px;

      h1 {
        margin-top: 0;
      }

      p {
        text-align: left;
      }
    }
  }

  .rules__table {
    margin-bottom: 20px;

    p {
      margin: 0;
      display: flex;
      justify-content: space-between;
      line-height: 3;
      border-bottom: 1px solid #e2e2e2;
    }

    .value {
      color: #595b98;
      font-weight: bold;
    }
  }

  .roles__navigation {
    display: flex;
    margin-bottom: 40px;

    a {
      font-size: 20px;
      font-weight: bold;
      color: #c9ced2;
      text-decoration: none;

      & + a::before {
        content: "";
        display: inline-block;
        width: 4px;
        height: 4px;
        background: #dc3c2c;
        border-radius: 3px;
        margin-bottom: 3px;
        margin-left: 20px;
        margin-right: 20px;
      }

      &::after {
        content: "";
        display: block;
        width: 0px;
        height: 3px;
        background: #c9ced2;
        border-radius: 3px;
        position: absolute;
        transform: translateY(6px);
        transition: 0.2s all ease-in;
      }

      &:not(:first-child)::after {
        transform: translateX(44px) translateY(6px);
      }

      &:hover::after {
        width: 24px;
      }

      &.selected {
        color: #595b98;

        &::after {
          width: 24px;
          background: #595b98;
        }
      }
    }
  }

  .cards {
    div {
      flex: 1;
    }

    &::before {
      display: block;
      content: url("./images/circulos.png");
      position: absolute;
      z-index: 0;
      left: 0;
      transform: translateX(-50%) translateY(-38%);
    }

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

  .ilustra {
    float: right;
  }

  @media (max-width: 760px) {
    .container {
      padding: 60px 15px;
    }

    .roles__navigation {
      margin-top: 50px;

      a {
        font-size: 16px;

        &::before {
          margin-left: 10px;
        }
      }
    }

    .cards {
      &::before {
        zoom: 0.5;
      }
    }
  }
`;

export default StyledScreenHowItWorks;
