import React from "react";
import { Flex, Button } from "@chakra-ui/react";
import Link from "next/link";

const ComunidadeNotFound: React.FC = () => {
  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh"
    >
      Desculpe, essa comunidade não existe ou foi recentemente excluida
      <Link href="/">
        <Button mt={4}>Voltar para Home</Button>
      </Link>
    </Flex>
  );
};
export default ComunidadeNotFound;
