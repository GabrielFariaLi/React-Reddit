import { Flex } from "@chakra-ui/react";
import React from "react";

type ConteudoPaginaProps = {
  children?: any;
};

const ConteudoPagina: React.FC<ConteudoPaginaProps> = ({ children }) => {
  //console.log("here is children ", children);
  return (
    <Flex justify={"center"} p="16px 0px">
      <Flex
        // VALORES COMBINADOS COM O HEADER PARA OFERECER MAIS RESPONSIVIDADE EM TODA APLICAÇÃO
        width={"95%"}
        justify={"center"}
        maxWidth={"860px"}
      >
        {/* ESQUERDA */}
        <Flex
          direction={"column"}
          width={{ base: "100%", md: "65%" }}
          mr={{ base: 0, md: 6 }}
        >
          {children && children[0 as keyof typeof children]}
        </Flex>

        {/* DIREITA */}
        <Flex
          direction={"column"}
          display={{ base: "none", md: "flex" }}
          flexGrow={1}
        >
          {children && children[1 as keyof typeof children]}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default ConteudoPagina;
