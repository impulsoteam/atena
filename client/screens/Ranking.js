import React from "react";
import { Flex } from "@rebass/grid";
import StyledScreenRanking from "./Ranking.style";
import Layout from "Layout";
import Rectangle from "components/Rectangle";
import RectangleGroup from "components/RectangleGroup";
import Title from "components/Title";

const ScreenRanking = () => (
  <StyledScreenRanking>
    <Layout>
      <div className="_inner">
        <p className="super">
          Confira aqui a sua colocação no ranking da Atena. Vale lembrar que o
          <b> Ranking Mensal</b> exibe o <b>saldo</b> de XP que você obteve
          <b> durante um mês</b>. Já o <b>Ranking Geral</b> exibe o saldo de XP
          de toda sua jornada na Impulso!
        </p>
        <RectangleGroup>
          <Rectangle active left>
            <a href="#">Ranking Mensal</a>
          </Rectangle>
          <Rectangle right>
            <a href="#">Ranking Geral</a>
          </Rectangle>
        </RectangleGroup>
        <Flex justifyContent="center">
          <Title width={"384px"} align={"center"} extraLarge>
            RANKING DO MÊS DE <span className="month">JANEIRO</span>
          </Title>
        </Flex>
      </div>
    </Layout>
  </StyledScreenRanking>
);

export default ScreenRanking;
