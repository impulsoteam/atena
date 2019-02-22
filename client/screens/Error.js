import React from "react";
import PropTypes from "prop-types";
import { Flex } from "@rebass/grid";
import Layout from "Layout";
import Title from "components/Title";
import StyledScreenError from "./Error.style";

const ScreenError = ({
  message = "Caro(a) cavaleiro(a), aconteceu um erro. Por favor tente novamente."
}) => (
  <StyledScreenError>
    <Layout>
      <div className="_inner">
        <Flex justifyContent="center">
          <Title align={"center"} extraLarge>
            Error
          </Title>
        </Flex>
        <p className="super">{message}</p>
      </div>
    </Layout>
  </StyledScreenError>
);

ScreenError.propTypes = {
  message: PropTypes.string
};

export default ScreenError;
