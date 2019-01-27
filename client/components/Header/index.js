import React from "react";
import StyledHeader from "./style";
import { Flex, Box } from "@rebass/grid";
import Menu from "./Menu";

const Header = () => (
  <StyledHeader>
    <Flex justifyContent="space-between" alignItems="center">
      <Box>
        <img src="/images/atena.svg" />
      </Box>
      <Box>
        <Menu />
      </Box>
    </Flex>
  </StyledHeader>
);

export default Header;
