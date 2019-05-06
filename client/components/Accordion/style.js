import styled from "styled-components";

const StyledAccordion = styled.div`
  & > a {
    text-decoration: none;
    border-bottom: 1px solid #e2e2e2;
    display: block;
    cursor: pointer;

    &:focus {
      outline: none;

      .accordion__link {
        color: ${props => props.theme.color.primary};

        i {
          transition: 0.2s all ease-in;
          transform: rotate(180deg);
        }
      }

      .accordion_content {
        opacity: 1;
        visibility: visible;
        height: auto;
        transition: 0.2s all ease-in;

        & > p {
          color: ${props => props.theme.color.gray};
          text-align: left;
          margin-bottom: 30px;
        }
      }
    }
  }

  .accordion_content {
    height: 0;
    opacity: 0;
    visibility: hidden;
  }

  .accordion__link {
    color: ${props => props.theme.color.gray};
    font-size: ${props => props.theme.fontSize.medium};
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding: 30px 0px;

    &:hover {
      color: ${props => props.theme.color.primary};
    }
  }
`;

export default StyledAccordion;
