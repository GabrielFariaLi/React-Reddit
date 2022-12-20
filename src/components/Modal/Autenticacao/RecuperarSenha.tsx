import React, { useState } from "react";
import { Button, Flex, Icon, Input, Text } from "@chakra-ui/react";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { BsDot, BsReddit } from "react-icons/bs";
import {
  autenticacaoModalState /* , ModalView */,
} from "../../../atoms/autenticacaoModalAtom";
import { autenticacaoFirebase } from "../../../firebase/clientApp";
import { useSetRecoilState } from "recoil";

type RecuperarSenhaProps = {
  /*   toggleView: (view: ModalView) => void; */
};

const RecuperarSenha: React.FC<RecuperarSenhaProps> = () => {
  const setAutenticaoModalState = useSetRecoilState(autenticacaoModalState);
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(autenticacaoFirebase);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await sendPasswordResetEmail(email);
    setSuccess(true);
  };
  return (
    <Flex direction="column" alignItems="center" width="100%">
      <Icon as={BsReddit} color="brand.100" fontSize={40} mb={2} />
      <Text fontWeight={700} mb={2}>
        Recuperar sua senha
      </Text>
      {success ? (
        <Text mb={4}>Porfavor, cheque seu e-mail 😀</Text>
      ) : (
        <>
          <Text fontSize="sm" textAlign="center" mb={2}>
            Introduza o e-mail associado com aconta e lhe enviaremos um link
            para recuperar sua senha
          </Text>
          <form onSubmit={onSubmit} style={{ width: "100%" }}>
            <Input
              required
              name="email"
              placeholder="email"
              type="email"
              mb={2}
              onChange={(event) => setEmail(event.target.value)}
              fontSize="10pt"
              _placeholder={{ color: "gray.500" }}
              _hover={{
                bg: "white",
                border: "1px solid",
                borderColor: "blue.500",
              }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "blue.500",
              }}
              bg="gray.50"
            />
            <Text textAlign="center" fontSize="10pt" color="red">
              {error?.message}
            </Text>
            <Button
              width="100%"
              height="36px"
              mb={2}
              mt={2}
              type="submit"
              isLoading={sending}
            >
              Reset Password
            </Button>
          </form>
        </>
      )}
      <Flex
        alignItems="center"
        fontSize="9pt"
        color="blue.500"
        fontWeight={700}
        cursor="pointer"
      >
        <Text
          onClick={() =>
            setAutenticaoModalState((prev) => ({
              ...prev,
              view: "login",
            }))
          }
        >
          LOGIN
        </Text>
        <Icon as={BsDot} />
        <Text
          onClick={() =>
            setAutenticaoModalState((prev) => ({
              ...prev,
              view: "registrar",
            }))
          }
        >
          REGISTRAR
        </Text>
      </Flex>
    </Flex>
  );
};
export default RecuperarSenha;
