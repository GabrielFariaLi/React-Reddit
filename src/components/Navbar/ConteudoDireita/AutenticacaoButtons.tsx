import { Button } from "@chakra-ui/react";
import React from "react";
import { useSetRecoilState } from "recoil";
import { autenticacaoModalState } from "../../../atoms/autenticacaoModalAtom";

type AutenticacaoButtonsProps = {};

const AutenticacaoButtons: React.FC<AutenticacaoButtonsProps> = () => {
  const setAutenticaoModalState = useSetRecoilState(autenticacaoModalState);
  return (
    <>
      <Button
        variant="outline"
        height="28px"
        display={{ base: "none", sm: "flex" }}
        width={{ base: "70px", md: "110px" }}
        mr={2}
        onClick={() => setAutenticaoModalState({ open: true, view: "login" })}
      >
        Log in
      </Button>
      <Button
        height="28px"
        display={{ base: "none", sm: "flex" }}
        width={{ base: "70px", md: "110px" }}
        mr={2}
        onClick={() =>
          setAutenticaoModalState({ open: true, view: "registrar" })
        }
      >
        Registrar
      </Button>
    </>
  );
};
export default AutenticacaoButtons;
