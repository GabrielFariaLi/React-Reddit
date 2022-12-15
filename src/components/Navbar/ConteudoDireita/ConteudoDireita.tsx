import { Flex } from "@chakra-ui/react";
import React from "react";
import AutenticacaoModal from "../../Modal/Autenticacao/AutenticacaoModal";
import AutenticacaoButtons from "./AutenticacaoButtons";

type ConteudoDireitaProps = {};

const ConteudoDireita: React.FC<ConteudoDireitaProps> = () => {
  return (
    <>
      <AutenticacaoModal />
      <Flex justify="center" align="center">
        <AutenticacaoButtons />
      </Flex>
    </>
  );
};
export default ConteudoDireita;
