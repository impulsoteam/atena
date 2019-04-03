import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Flex, Box } from "@rebass/grid";
import StyledScreenRanking from "./Ranking.style";
import Layout from "Layout";
import Rectangle from "components/Rectangle";
import RectangleGroup from "components/RectangleGroup";
import RankingHeader from "components/RankingHeader";
import RankingRow from "components/RankingRow";
import Title from "components/Title";
import UserCard from "components/UserCard";
import FullPage from "../components/FullPage";

const generalTitle = () => (
  <Fragment>
    RANKING <br />
    <span className="month">GERAL</span>
  </Fragment>
);

const monthlyTitle = monthName => (
  <Fragment>
    RANKING DO <br />
    MÊS DE <span className="month">{monthName}</span>
  </Fragment>
);
const ScreenRanking = ({
  page = "ranking",
  monthName,
  first_users,
  last_users,
  error
}) => (
  <StyledScreenRanking>
    <Layout>
      <FullPage background="url('./images/bg_ranking.png')" height="40" overlay>
        <Flex alignItems="baseline" justifyContent="center" flex="1">
          <Box>
            <Title large color="white" align="center">
              Ranking
            </Title>
          </Box>
        </Flex>
      </FullPage>
      <div className="_inner">
        <p className="super">
          Confira aqui a sua colocação no ranking da Atena. Vale lembrar que o
          <b> Ranking Mensal</b> exibe o <b>saldo</b> de XP que você obteve
          <b> durante um mês</b>. Já o <b>Ranking Geral</b> exibe o saldo de XP
          de toda sua jornada na Impulso!
        </p>
        <Flex justifyContent="center" alignItems="center" mt={100} mb={100}>
          <RectangleGroup>
            <Rectangle active={page === "ranking"} left>
              <a href="/ranking">Ranking Mensal</a>
            </Rectangle>
            <Rectangle active={page === "geral"} right>
              <a href="/ranking/geral">Ranking Geral</a>
            </Rectangle>
          </RectangleGroup>
        </Flex>
        <Flex justifyContent="center">
          <Title align={"center"} extraLarge>
            {page === "general" ? generalTitle() : monthlyTitle(monthName)}
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
  error: PropTypes.string,
  page: PropTypes.string
};

ScreenRanking.defaultProps = {
  error: null
};

export default ScreenRanking;
