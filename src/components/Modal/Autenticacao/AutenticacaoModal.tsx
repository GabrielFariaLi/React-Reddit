import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Flex,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";
import { autenticacaoModalState } from "../../../atoms/autenticacaoModalAtom";
import { autenticacaoFirebase } from "../../../firebase/clientApp";
import AutenticacaoInputs from "./AutenticacaoInputs";
import OAuthButtons from "./OAuthButtons";
import RecuperarSenha from "./RecuperarSenha";

const AutenticacaoModal: React.FC = () => {
  const [modalState, setModalState] = useRecoilState(autenticacaoModalState);
  const [user, loading, error] = useAuthState(autenticacaoFirebase);

  const handleClose = () => {
    setModalState((prev) => ({
      ...prev,
      open: false,
    }));
  };

  useEffect(() => {
    if (user) handleClose();
  }, [user]);
  return (
    <>
      <Modal isOpen={modalState.open} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            {modalState.view === "login" && "Login"}
            {modalState.view === "registrar" && "Registrar"}
            {modalState.view === "resetPassword" && "Esqueceu a senha?"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            pb={6}
          >
            <Flex
              direction="column"
              align="center"
              justify="center"
              width="70%"
            >
              {modalState.view === "login" ||
              modalState.view === "registrar" ? (
                <>
                  <OAuthButtons />
                  <Text color="gray.500" fontWeight={700}>
                    {" "}
                    OU
                  </Text>
                  <AutenticacaoInputs />
                </>
              ) : (
                <RecuperarSenha />
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default AutenticacaoModal;
