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
import React from "react";
import { useRecoilState } from "recoil";
import { autenticacaoModalState } from "../../../atoms/autenticacaoModalAtom";
import AutenticacaoInputs from "./AutenticacaoInputs";
import OAuthButtons from "./OAuthButtons";

const AutenticacaoModal: React.FC = () => {
  const [modalState, setModalState] = useRecoilState(autenticacaoModalState);

  const handleClose = () => {
    setModalState((prev) => ({
      ...prev,
      open: false,
    }));
  };
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
              <OAuthButtons />
              <Text color="gray.500" fontWeight={700}>
                {" "}
                OU
              </Text>
              <AutenticacaoInputs />
              {/* Reset password */}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default AutenticacaoModal;
