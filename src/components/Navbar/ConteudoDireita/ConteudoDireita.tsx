import { Button, Flex } from "@chakra-ui/react";
import { signOut, User } from "firebase/auth";
import React from "react";
import { autenticacaoFirebase } from "../../../firebase/clientApp";
import AutenticacaoModal from "../../Modal/Autenticacao/AutenticacaoModal";
import AutenticacaoButtons from "./AutenticacaoButtons";
import Icons from "./Icons";
import MenuUtilizador from "./MenuUtilizador";

type ConteudoDireitaProps = {
  user?: User | null;
};

const ConteudoDireita: React.FC<ConteudoDireitaProps> = (props) => {
  return (
    <>
      <AutenticacaoModal />
      <Flex justify="center" align="center">
        {props.user ? <Icons /> : <AutenticacaoButtons />}
        <MenuUtilizador user={props.user} />
      </Flex>
    </>
  );
};
export default ConteudoDireita;
