import { Flex, Button, Image, Text } from "@chakra-ui/react";
import React from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { autenticacaoFirebase } from "../../../firebase/clientApp";

const OAuthButtons: React.FC = () => {
  const [signInWithGoogle, user, loading, errorGoogle] =
    useSignInWithGoogle(autenticacaoFirebase);
  return (
    <Flex direction="column" width="100%" mb={4}>
      <Button
        variant="oauth"
        mb={2}
        isLoading={loading}
        onClick={() => signInWithGoogle()}
      >
        <Image src="/imgs/googlelogo.png" height="20px" mr={4} />
        Continuar com o Goggle
      </Button>
      {errorGoogle && <Text>{errorGoogle?.message}</Text>}
      <Button variant="oauth" mb={2}>
        Outros...
      </Button>
    </Flex>
  );
};
export default OAuthButtons;
