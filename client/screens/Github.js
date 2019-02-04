import React from "react";
import StyledScreenGithub from "./Github.style";
import Layout from "../Layout";
import Card from "../components/Card";
import Title from "../components/Title";

const ScreenGithub = () => {
  return (
    <StyledScreenGithub>
      <Layout>
        <div className="_inner">
          <Card large>
            <span className="cardIcon">
              <i className="fab fa-github" />
            </span>
            <p className="super">
              <strong>Olá novamente, nobre Impulser!</strong>
            </p>
            <Title align="center">
              Sua dedicação foi posta a prova e você passou com honrarias!
            </Title>
            <p className="super">
              A partir de agora você pode desempenhar trabalhos junto aos nossos{" "}
              <strong>projetos open-source!</strong>
            </p>
          </Card>
          <p className="super">
            Ainda está em dúvida de como funcionam?!
            <br />
            Não tem problema, dá uma olhadinha aqui nesse papiro:
            <br />
            <a href="https://impulso.network/">https://impulso.network</a>
          </p>
        </div>
      </Layout>
    </StyledScreenGithub>
  );
};

export default ScreenGithub;
