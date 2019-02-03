import React from "react";
import { StyledRankingHeader } from "./style";

const RankingHeader = () => (
  <StyledRankingHeader>
    <div className="ranking">RANKING</div>
    <div className="userInfo" />
    <div className="level">LEVEL</div>
    <div className="xp">XP</div>
  </StyledRankingHeader>
);

export default RankingHeader;
