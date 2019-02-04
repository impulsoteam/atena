import styled from "styled-components";

export const StyledRankingHeader = styled.div`
  width: 100%;
  display: flex;
  color: #595b98;
  font-size: 20px;
  font-weight: bold;
  .ranking {
    flex: 1;
    max-width: 88px;
  }
  .level {
    flex: 2;
    max-width: 83px;
    text-align: center;
  }
  .xp {
    flex: 1;
    max-width: 120px;
    text-align: center;
  }
  .userInfo {
    flex: 2;
  }
`;

export default StyledRankingHeader;
