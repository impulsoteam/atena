import React from "react";
import PropTypes from "prop-types";
import { StyledUserCard, StyledContainer, StyledPosition, StyledInfo } from "./style";
// import { Flex, Box } from "@rebass/grid";
//

const Position = ({ children }) => (
  <StyledPosition>
    {children}
  </StyledPosition>
);

const Info = ({ children }) => (
  <StyledInfo>
    <h1>{children}</h1>
  </StyledInfo>
);

const Container = ({ children }) => (
  <StyledContainer>
    <figure>
      <img src="https://chat.impulso.network/avatar/renato?_dc=0" />
    </figure>
    <Position>1º</Position>
    <Info>{children}</Info>
  </StyledContainer>
);

const UserCard = ({ children, ...props }) => (
  <StyledUserCard {...props}>
    <Container>{children}</Container>
  </StyledUserCard>
);

UserCard.propTypes = {
  children: PropTypes.element.isRequired,
  width: PropTypes.string
};

UserCard.defaultProps = {
  width: "325px"
};

Container.propTypes = {
  children: PropTypes.element.isRequired
};

export default UserCard;
