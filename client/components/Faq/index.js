import React from 'react'
import StyledFaq from './style'
import { Flex, Box } from '@rebass/grid'
import Title from '../Title'
import Accordion from '../Accordion'
import Button from '../Button'

const questions = [
  {
    content: 'Como me comunico com a Atena?',
    awnser:
      'Para centralizar as informações a respeito da sua Experiência, Níveis e Conquistas criamos a bot ATENA. Através de comandos é possível pedir à Atena para exibir seu XP (/meuspontos), Ranking Geral de XP (/ranking) e Conquistas (/minhasconquistas).'
  },
  {
    content: 'Existirão atualizações?',
    awnser:
      'Sim! A Impulso Network é muito dinâmica e não para de crescer. O surgimento de novos canais, atividades e práticas corriqueiras e positivas na comunidade serão mapeadas para que novas features sejam criadas.'
  },
  {
    content: 'Existe alguma premiação?',
    awnser:
      'Claro! Além da Reputação obtida através da sua participação na comunidade (representada por XP e Níveis), Atena poderá te premiar com acesso a atividades especiais da comunidade, cupons de desconto para serviços, além de produtos e brindes exclusivos.'
  },
  {
    content: 'Qual a diferença entre ranking mensal e geral?',
    awnser:
      'Enquanto o Ranking Geral valoriza o esforço durante todo o seu percurso com a Atena e mostra o acumulado de XP e seu Nível, o Ranking Mensal foca no que foi realizado e recompensa o primeiro colocado naquele mês.'
  },
  {
    content: 'Como faço para participar do projeto?',
    awnser:
      'Qualquer pessoa pode ajudar Atena a crescer, basta entrar no canal #projeto-atena no nosso Rocket.chat ou acessar diretamente o nosso repositório no Github (http://github.com/UniversoImpulso/atena). Ainda não faz parte da Impulso Network? Basta acessar o https://app.impulso.network/ e fazer o seu cadastro, é rapidinho.'
  }
]

const Faq = () => (
  <StyledFaq>
    <Flex
      justifyContent="space-between"
      css={{ margin: '0 -25px' }}
      flexWrap="wrap"
    >
      <Box width={[1, 2 / 5]} px={25}>
        <Title extralarge>
          Dúvi
          <br />
          Das <br />
          <span className="red">
            Fre
            <br />
            quen
            <br />
            tes
          </span>
        </Title>
      </Box>
      <Box width={[1, 3 / 5]} px={25}>
        <Accordion data={questions} />
        <Button>
          <a href="https://www.notion.so/impulso/Atena-Um-projeto-de-gamifica-o-open-source-da-Impulso-cac95f0898e648f6a31f5911a3c46d41">
            Mais dúvidas
          </a>
        </Button>
      </Box>
    </Flex>
  </StyledFaq>
)

export default Faq
