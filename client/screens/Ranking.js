import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Header from "components/Header";
import { Flex, Box } from "@rebass/grid";

const ScreenRanking = ({ name }) => (
  <Flex style={{ backgroundColor: "green" }}>
    <Box width={1 / 6} px={2} style={{ backgroundColor: "red" }}>
      <Header name={name} />
      hal
    </Box>
    <Box width={1 / 2} px={2}>
      <p>
        Confira aqui a sua colocação no ranking da Atena. Vale lembrar que o
        Ranking Mensal exibe o saldo de XP que você obteve durante um mês. Já o
        Ranking Geral exibe o saldo de XP de toda sua jornada na Impulso!
      </p>
    </Box>
  </Flex>
);
ScreenRanking.propTypes = {
  name: PropTypes.string
};

ScreenRanking.defaultProps = {
  name: "Ranking"
};

export default ScreenRanking;
