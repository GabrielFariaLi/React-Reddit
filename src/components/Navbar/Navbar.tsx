import { Flex, Image } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { autenticacaoFirebase } from "../../firebase/clientApp";
import ConteudoDireita from "./ConteudoDireita/ConteudoDireita";
import Diretorio from "./Diretorio/Diretorio";
import InputBusca from "./InputBusca";

const Navbar: React.FC = () => {
  const [user, loading, error] = useAuthState(autenticacaoFirebase);

  return (
    <Flex
      bg="white"
      height="44px"
      padding="6px 12px"
      justify={{ md: "space-between" }}
    >
      <Flex
        align="center"
        width={{ base: "40px", md: "auto" }}
        mr={{ base: 0, md: 2 }}
      >
        <Link href="/">
          <Image src="/imgs/redditFace.svg" height="30px" />
        </Link>{" "}
        <Image
          src="/imgs/redditText.svg"
          height="46px"
          display={{ base: "none", md: "unset" }}
        />
      </Flex>
      {user && <Diretorio />}
      <InputBusca user={user} />
      <ConteudoDireita user={user} />
    </Flex>
  );
};
export default Navbar;
