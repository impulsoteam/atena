import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Flex } from "@rebass/grid";
import StyledScreenRanking from "./Ranking.style";
import Layout from "Layout";
import Rectangle from "components/Rectangle";
import RectangleGroup from "components/RectangleGroup";
import RankingHeader from "components/RankingHeader";
import RankingRow from "components/RankingRow";
import Title from "components/Title";
import UserCard from "components/UserCard";

const ScreenRanking = ({ monthName, first_users, last_users, error }) => (
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
          <Title align={"center"} extraLarge>
            RANKING DO <br />
            MÊS DE <span className="month">{monthName}</span>
          </Title>
        </Flex>
        {error && (
          <Flex justifyContent="center">
            <h1>{error}</h1>
          </Flex>
        )}
        {!error && (
          <Fragment>
            <Flex justifyContent="center" mt={50} mb={80} ml={172} mr={172}>
              {first_users.map((card, index) => (
                <UserCard key={index} first={index == 1 && true} {...card} />
              ))}
            </Flex>
            <Flex
              justifyContent="space-around"
              mt={50}
              mb={50}
              ml={172}
              mr={172}
              flexWrap="wrap"
            >
              <RankingHeader />
              {last_users.map((card, index) => (
                <RankingRow key={index} {...card} />
              ))}
            </Flex>
          </Fragment>
        )}
      </div>
    </Layout>
  </StyledScreenRanking>
);

ScreenRanking.propTypes = {
  monthName: PropTypes.string.isRequired,
  first_users: PropTypes.array.isRequired,
  last_users: PropTypes.array.isRequired,
  error: PropTypes.string
};

ScreenRanking.defaultProps = {
  error: null
};

export default ScreenRanking;
