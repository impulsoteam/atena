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

const ScreenHowItWorks = props => {
  return (
    <StyledScreenHowItWorks>
      <Layout {...props}>
        <FullPage background="url('./images/hiwlpc.png')">
          <Flex alignItems="center" justifyContent="center" flex="1">
            <Box>
              <Title large color="white" align="center">
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
          <Flex alignItems="center" flexWrap="wrap">
            <Box width={[1, 1 / 2]}>
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
              <p className="super ifdesktop">
                Assim que você entra na comunidade, automaticamente se tornará
                um(a) jogador(a) e poderá pontuar por meio da execução de
                diversas <strong>atividades</strong>, alcançar{" "}
                <strong>Níveis</strong> e obter <strong>conquistas</strong> como
                reconhecimento pelos seus esforços.
              </p>
            </Box>
            <Box width={[1, 1 / 2]}>
              <img src="./images/ilustra-atena.svg" className="ilustra" />
            </Box>
          </Flex>
        </section>
        <section className="container xprules">
          <Flex justifyContent="center">
            <Box width={4 / 5}>
              <Title large align="center">
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
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.onload=function(){
              document
              .querySelectorAll(".a--rules--button")
              .forEach(function(x) {
                x.addEventListener('click', function(ev) {
                  if (!ev.currentTarget.classList.contains('selected')) {
                    document.querySelector('.a--rules--button.selected').classList.remove('selected');
                    ev.currentTarget.classList.add('selected');
                    document.querySelector('.rules__inner.selected').classList.remove('selected');
                    console.log(ev.currentTarget.dataset.destiny);
                    document.querySelector('.rules__inner-'+ev.currentTarget.dataset.destiny).classList.add('selected');

                  }
                })
              });
            }
          `
            }}
          />
          <Flex css={{ margin: "0 -25px" }} className="rules ifdesktop">
            <Box width={1 / 3} px={0}>
              <a
                href="javascript:;"
                className="selected a--rules--button"
                data-destiny="1"
              >
                <span>01. Obtendo XP</span>
              </a>
            </Box>
            <Box width={1 / 3} px={0}>
              <a
                href="javascript:;"
                className="a--rules--button"
                data-destiny="2"
              >
                <span>02. Perdendo XP</span>
              </a>
            </Box>
            <Box width={1 / 3} px={0}>
              <a
                href="javascript:;"
                className="a--rules--button"
                data-destiny="3"
              >
                <span>03. Exceções</span>
              </a>
            </Box>
          </Flex>
          <Flex
            css={{ margin: "0 -30px" }}
            className="rules__inner rules__inner-1 selected"
            flexWrap="wrap"
          >
            <Box width={[1, 1 / 2]} px={30}>
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
            <Box width={[1, 1 / 2]} px={30}>
              <div className="roles__navigation">
                <a href="javascript:;" className="selected">
                  Rocket.Chat
                </a>
                <a href="javascript:;">Blog</a>
                <a href="javascript:;">Open-Source</a>
              </div>
              <div className="rules__table">
                <p>
                  Mensagem postada <span className="value">+1 xp</span>
                </p>
                <p>
                  Reaction dado <span className="value">+1 xp</span>
                </p>
                <p>
                  Reply recebido <span className="value">+2 xp</span>
                </p>
              </div>
              <Button>
                <a href="https://www.notion.so/impulso/XP-O-que-e-como-ganhar-372bc91f3e404b418b50267ddcadce6f">
                  mais detalhes
                </a>
              </Button>
            </Box>
          </Flex>
          <Flex
            css={{ margin: "0 -30px" }}
            className="rules__inner rules__inner-2"
            flexWrap="wrap"
          >
            <Box width={[1, 1 / 2]} px={30}>
              <Title>
                <span className="red">02.</span>
                <br />
                PERDENDO XP
              </Title>
              <p>
                Em oposição às atividades que promovem a obtenção de XP, a única
                forma de perder pontos de experiência é através da{" "}
                <strong>Inatividade Completa</strong> na comunidade Impulso. A
                inatividade começa a contar no dia seguinte à sua última
                participação e a perda de pontos a partir da quantidade de dias
                pré-definida, que varia de acordo com cada canal.
              </p>
            </Box>
          </Flex>
          <Flex
            css={{ margin: "0 -30px" }}
            className="rules__inner rules__inner-3"
            flexWrap="wrap"
          >
            <Box width={[1, 1 / 2]} px={30}>
              <Title>
                <span className="red">03.</span>
                <br />
                EXCEÇÕES
              </Title>
              <p>
                Caso a <strong>quantidade de XP</strong> que você obteve através
                de <strong>reactions negativos recebidos</strong> em uma
                publicação <strong>seja superior</strong> à obtida por reactions
                positivos o XP não é negativado, a pontuação através das
                reactions daquela mensagem ficará zerada (0).
              </p>
            </Box>
          </Flex>
        </section>
        <section className="container cards">
          <Flex css={{ margin: "0 -25px" }} flexWrap="wrap">
            <Box width={[1, 1 / 2]} px={25}>
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
                <Button>
                  <a href="https://www.notion.so/impulso/N-veis-O-que-s-o-e-como-ganhar-6d67592b078f49b3879ce4db91081be4">
                    mais detalhes
                  </a>
                </Button>
              </Card>
            </Box>
            <Box
              width={[1, 1 / 2]}
              px={25}
              css={{
                display: "flex",
                flexDirection: "column"
              }}
            >
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
                <Button>
                  <a href="notion.so/impulso/Conquistas-O-que-s-o-e-como-ganhar-f8cded2569e7411ebabb78c8e99a2f94">
                    mais detalhes
                  </a>
                </Button>
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
