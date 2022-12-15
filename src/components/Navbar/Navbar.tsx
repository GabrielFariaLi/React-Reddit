import { Flex, Image } from "@chakra-ui/react";
import React from "react";
import ConteudoDireita from "./ConteudoDireita/ConteudoDireita";
import InputBusca from "./InputBusca";

const Navbar: React.FC = () => {
  return (
    <Flex bg="white" height="44px" padding="6px 12px">
      <Flex align="center">
        <Image src="/imgs/redditFace.svg" height="30px" />
        <Image
          src="/imgs/redditText.svg"
          height="46px"
          display={{ base: "none", md: "unset" }}
        />
      </Flex>
      <InputBusca />
      <ConteudoDireita />
    </Flex>
  );
};
export default Navbar;
