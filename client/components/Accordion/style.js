import styled from "styled-components";

const StyledAccordion = styled.div`
  .accordion_content {
    height: 0;
    opacity: 0;
    visibility: hidden;
  }

  .accordion__link {
    color: ${props => props.theme.color.gray};
    font-size: ${props => props.theme.fontSize.medium};
    text-decoration: none;
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding: 30px 0px;
    border-bottom: 1px solid #e2e2e2;

    &:hover {
      color: ${props => props.theme.color.secondary};
    }
  }
`;

export default StyledAccordion;
