import React from "react";
import PropTypes from "prop-types";
import StyledUserCard from "./style";
// import { Flex, Box } from "@rebass/grid";

const UserCard = ({ children, ...props }) => (
  <StyledUserCard {...props}>{children}</StyledUserCard>
);

UserCard.propTypes = {
  children: PropTypes.element.isRequired,
  width: PropTypes.string
};

UserCard.defaultProps = {
  width: "298px"
};

export default UserCard;
