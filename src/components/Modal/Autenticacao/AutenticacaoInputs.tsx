import { Flex } from "@chakra-ui/react";
import React from "react";
import { useRecoilValue } from "recoil";
import { autenticacaoModalState } from "../../../atoms/autenticacaoModalAtom";
import Login from "./Login";
import Registrar from "./Registrar";

type AutenticacaoInputsProps = {};

const AutenticacaoInputs: React.FC<AutenticacaoInputsProps> = () => {
  const modalState = useRecoilValue(autenticacaoModalState);
  return (
    <Flex direction="column" align="center" width="100%" mt={4}>
      {modalState.view === "login" && <Login />}
      {modalState.view === "registrar" && <Registrar />}
    </Flex>
  );
};
export default AutenticacaoInputs;
