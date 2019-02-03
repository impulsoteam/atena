import React from "react";
import PropTypes from "prop-types";
import {
  StyledUserCard,
  StyledContainer,
  StyledPosition,
  StyledInfo,
  StyledPoint
} from "./style";
import { Flex } from "@rebass/grid";

const Position = ({ children }) => <StyledPosition>{children}</StyledPosition>;

const Point = ({ label, value, ...props }) => (
  <StyledPoint {...props}>
    <p>{label}</p>
    <p>{value}</p>
  </StyledPoint>
);

const Info = ({ name, level, xp }) => (
  <StyledInfo>
    <h1>{name}</h1>
    <Flex justifyContent="center">
      <Point label="Level" value={level} border />
      <Point label="XP" value={xp} />
    </Flex>
  </StyledInfo>
);

const Container = ({ position, avatar, ...props }) => (
  <StyledContainer>
    <figure>
      <img src={avatar} />
    </figure>
    <Position>{position}º</Position>
    <Info {...props} />
  </StyledContainer>
);

const UserCard = ({ ...props }) => (
  <StyledUserCard {...props}>
    <Container {...props} />
  </StyledUserCard>
);

UserCard.propTypes = {
  width: PropTypes.string
};

UserCard.defaultProps = {
  width: "325px"
};

Container.propTypes = {
  position: PropTypes.number.isRequired,
  avatar: PropTypes.string
};

Point.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired
};

Info.propTypes = {
  name: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired,
  xp: PropTypes.number.isRequired
};

Position.propTypes = {
  children: PropTypes.element.isRequired
};

export default UserCard;
