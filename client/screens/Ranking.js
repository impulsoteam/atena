import React from "react";
import { Flex, Box } from "@rebass/grid";
import StyledScreenRanking from "./Ranking.style";
import Layout from "Layout";
import Rectangle from "components/Rectangle";
import RectangleGroup from "components/RectangleGroup";
import RankingHeader from "components/RankingHeader";
import Title from "components/Title";
import UserCard from "components/UserCard";

const data = [
  {
    name: "Renato Tarantelli",
    level: 10,
    xp: 1000,
    avatar: 'https://chat.impulso.network/avatar/renato?_dc=0"',
    position: 2
  },
  {
    name: "Renato Tarantelli",
    level: 10,
    xp: 1000,
    avatar: 'https://chat.impulso.network/avatar/renato?_dc=0"',
    position: 1
  },
  {
    name: "Renato Tarantelli",
    level: 10,
    xp: 1000,
    avatar: 'https://chat.impulso.network/avatar/renato?_dc=0"',
    position: 3
  }
];

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
        <Flex justifyContent="center" alignItems="center" mt={100} mb={100}>
          <RectangleGroup>
            <Rectangle active left>
              <a href="#">Ranking Mensal</a>
            </Rectangle>
            <Rectangle right>
              <a href="#">Ranking Geral</a>
            </Rectangle>
          </RectangleGroup>
        </Flex>
        <Flex justifyContent="center">
          <Title width={"384px"} align={"center"} extraLarge>
            RANKING DO MÊS DE <span className="month">JANEIRO</span>
          </Title>
        </Flex>
        <Flex justifyContent="center" mt={50} mb={80} ml={172} mr={172}>
          {data.map((card, index) => (
            <UserCard key={index} first={index == 1 && true} {...card} />
          ))}
        </Flex>
        <Flex justifyContent="space-around" mt={50} mb={50} ml={172} mr={172}>
          <RankingHeader />
        </Flex>
      </div>
    </Layout>
  </StyledScreenRanking>
);

export default ScreenRanking;
