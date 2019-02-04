import React from "react";
import StyledFaq from "./style";
import { Flex, Box } from "@rebass/grid";
import Title from "../Title";
import Accordion from "../Accordion";
import Button from "../Button";

const questions = [
  {
    content: "Como me comunico com a Atena?",
    awnser:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
  },
  {
    content: "Existirão atualizações?",
    awnser:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
  },
  {
    content: "Existe alguma premiação?",
    awnser:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
  },
  {
    content: "Qual a diferença entre ranking mensal e geral?",
    awnser:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
  },
  {
    content: "Como faço para participar do projeto?",
    awnser:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
  }
];

const Faq = () => (
  <StyledFaq>
    <Flex
      alignItems="center"
      justifyContent="space-between"
      css={{ margin: "0 -25px" }}
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
        <Button>Mais dúvidas</Button>
      </Box>
    </Flex>
  </StyledFaq>
);

export default Faq;
