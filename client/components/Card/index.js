import React from "react";
import PropTypes from "prop-types";
import StyledCard from "./style";
import { Flex, Box } from "@rebass/grid";

const Card = props => {
  const { children } = props;

  return (
    <StyledCard>
      <Flex justifyContent="space-between" alignItems="center">
        <Box width={1}>{children}</Box>
      </Flex>
    </StyledCard>
  );
};

Card.propTypes = {
  children: PropTypes.element.isRequired
};

export default Card;
