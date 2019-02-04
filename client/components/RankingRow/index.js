import React from "react";
import { StyledRankingRow } from "./style";

const RankingRow = ({ position, name, avatar, level, xp }) => (
  <StyledRankingRow>
    <div className="ranking">{position}º</div>
    <div className="userInfo">
      <img src={avatar} />
      <p>{name}</p>
    </div>
    <div className="level">{level}</div>
    <div className="xp">{xp}</div>
  </StyledRankingRow>
);

export default RankingRow;
