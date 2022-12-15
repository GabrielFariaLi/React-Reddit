import { Button, Flex, Input, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import { autenticacaoModalState } from "../../../atoms/autenticacaoModalAtom";
import { autenticacaoFirebase } from "../../../firebase/clientApp";
import { FIREBASE_ERRORS } from "../../../firebase/errors";

type LoginProps = {};

const Login: React.FC<LoginProps> = () => {
  const setAutenticaoModalState = useSetRecoilState(autenticacaoModalState);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [signInWithEmailAndPassword, user, loading, errorSignIn] =
    useSignInWithEmailAndPassword(autenticacaoFirebase);

  // firebase seção
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    signInWithEmailAndPassword(loginForm.email, loginForm.password);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //update state form

    setLoginForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };
  return (
    <form onSubmit={onSubmit}>
      <Input
        required
        name="email"
        placeholder="email"
        type="email"
        mb={2}
        onChange={onChange}
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
      <Input
        required
        name="password"
        placeholder="Senha"
        type="password"
        mb={2}
        onChange={onChange}
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
      {errorSignIn && (
        <Text textAlign="center" color="red" fontSize="10pt">
          {
            FIREBASE_ERRORS[
              errorSignIn?.message as keyof typeof FIREBASE_ERRORS
            ]
          }
        </Text>
      )}
      <Button
        isLoading={loading}
        width="100%"
        height="36px"
        mt={2}
        mb={2}
        type="submit"
      >
        Log in
      </Button>
      <Flex fontSize="9pt" justifyContent="center">
        <Text mr={1}>Novo por aqui?</Text>
        <Text
          color="blue.500"
          fontWeight={700}
          cursor="pointer"
          onClick={() =>
            setAutenticaoModalState((prev) => ({
              ...prev,
              view: "registrar",
            }))
          }
        >
          REGISTRE-SE
        </Text>
      </Flex>
    </form>
  );
};
export default Login;
