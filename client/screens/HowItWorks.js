import React from "react";
import StyledScreenHowItWorks from "./HowItWorks.style";
import Layout from "../Layout";
import { Flex, Box } from "@rebass/grid";
import FullPage from "../components/FullPage";
import Title from "../components/Title";
import SubTitle from "../components/Title/SubTitle";
import Card from "../components/Card";
import Button from "../components/Button";
import Faq from "../components/Faq";

const ScreenHowItWorks = () => {
  return (
    <StyledScreenHowItWorks>
      <Layout>
        <FullPage background="#595B98">
          <Flex alignItems="center" justifyContent="center" flex="1">
            <Box>
              <Title large color="white">
                Bem vindo(a)
                <br />à atena!
              </Title>
              <SubTitle>
                Participe da comunidade, compartilhe ideias, construa projetos e
                ganhe pontos baseados em suas ações.
              </SubTitle>
            </Box>
          </Flex>
        </FullPage>
        <section className="container about">
          <Flex alignItems="center">
            <Box width={1 / 2}>
              <Title large color="primary">
                Mas afinal,
                <br />o que é a <span className="red">Atena</span> ?
              </Title>
              <p className="super">
                Inspirada na deusa grega da sabedoria, a <strong>Atena</strong>{" "}
                é uma iniciativa <strong>open source</strong> de gamificação da
                Impulso, que tem como objetivos promover o engajamento e premiar
                os esforços das pessoas que pertencem à Impulso Network.
              </p>
              <br />
              <p className="super">
                Assim que você entra na comunidade, automaticamente se tornará
                um(a) jogador(a) e poderá pontuar por meio da execução de
                diversas <strong>atividades</strong>, alcançar{" "}
                <strong>Níveis</strong> e obter <strong>conquistas</strong> como
                reconhecimento pelos seus esforços.
              </p>
            </Box>
          </Flex>
        </section>
        <section className="container xprules">
          <Flex justifyContent="center">
            <Box width={4 / 5}>
              <Title large>
                O que é e como <br />
                ganhar <span className="red">xp</span>?
              </Title>
              <p className="super">
                Sua pontuação será medida em{" "}
                <strong>Pontos de Experiência (XP)</strong>. Esse recurso é
                muito utilizado nos jogos como uma representação numérica do
                esforço e aprendizado obtido por um(a) personagem. Aqui na
                Impulso, a quantidade de XP será baseada nas atividades que você
                realizar na nossa comunidade.
              </p>
            </Box>
          </Flex>
          <Flex css={{ margin: "0 -25px" }} className="rules">
            <Box width={1 / 3} px={25} className="selected">
              01. Obtendo XP
            </Box>
            <Box width={1 / 3} px={25}>
              02. Perdendo XP
            </Box>
            <Box width={1 / 3} px={25}>
              03. Exceções
            </Box>
          </Flex>
          <Flex css={{ margin: "0 -30px" }} className="rules__inner">
            <Box width={1 / 2} px={30}>
              <Title>
                <span className="red">01.</span>
                <br />
                OBTENDO XP
              </Title>
              <p>
                A obtenção de pontos é feita através da{" "}
                <strong>realização de atividades</strong> dentro da Impulso. Por
                exemplo: participar de um curso da Impulso Academy, reagir à uma
                mensagem no Rocket.chat e até criar uma postagem no nosso Blog.
              </p>
            </Box>
            <Box width={1 / 2} px={30} />
          </Flex>
        </section>
        <section className="container cards">
          <Flex css={{ margin: "0 -25px" }}>
            <Box width={1 / 2} px={25}>
              <Card>
                <img src="/images/stars.svg" />
                <Title>
                  O QUE SÃO E<br /> COMO GANHAR <br />
                  <span className="red">NÍVEIS</span>?
                </Title>
                <p className="super">
                  Os <strong>Níveis</strong> são representações simplificadas do
                  seu avanço na Atena e são atingidos mediante uma determinada
                  quantidade de <strong>XP</strong>. Além disso, eles conferem o
                  acesso à novas missões, cargos e recompensas.
                </p>
                <Button>mais detalhes</Button>
              </Card>
            </Box>
            <Box width={1 / 2} px={25}>
              <Card>
                <img src="/images/badge.svg" />
                <Title>
                  O QUE SÃO E <br /> COMO GANHAR <br />{" "}
                  <span className="red">CONQUISTAS</span>?
                </Title>
                <p className="super">
                  <strong>Conquistas</strong> são formas de reconhecer o seu
                  esforço. Após realizar algo que mereça esse reconhecimento,
                  você será condecorado(a) com uma <strong>medalha</strong> que
                  representa este marco.
                </p>
                <Button>mais detalhes</Button>
              </Card>
            </Box>
          </Flex>
        </section>
        <section className="container faqs">
          <Faq />
        </section>
      </Layout>
    </StyledScreenHowItWorks>
  );
};

export default ScreenHowItWorks;
