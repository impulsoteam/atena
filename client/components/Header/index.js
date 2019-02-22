import React from "react";
import StyledHeader from "./style";
import { Flex, Box } from "@rebass/grid";
import Menu from "./Menu";

const Header = props => (
  <StyledHeader>
    <Flex justifyContent="space-between" alignItems="center">
      <Box flex="1">
        <img src="/images/atena.svg" />
      </Box>
      <Box>
        <Menu {...props} />
      </Box>
    </Flex>
  </StyledHeader>
);

export default Header;
