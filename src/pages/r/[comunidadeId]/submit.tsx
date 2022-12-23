import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";
import { comunidadeState } from "../../../atoms/comunidadesAtom";
import ConteudoPagina from "../../../components/Layout/ConteudoPagina";
import FormCriarPost from "../../../components/Posts/FormCriarPost";
import { autenticacaoFirebase } from "../../../firebase/clientApp";

const submitPostPagina: React.FC = () => {
  const [user] = useAuthState(autenticacaoFirebase);
  const comunidadeStateValue = useRecoilValue(comunidadeState);
  console.log("comunidadeState", comunidadeStateValue);
  return (
    <ConteudoPagina>
      <>
        <Box p="14px 0px" borderBottom={"1px solid"} borderColor="white">
          <Text>Criar um post</Text>
          {user && <FormCriarPost user={user} />}
        </Box>
      </>
      <>
        <div>direita</div>
      </>
    </ConteudoPagina>
  );
};
export default submitPostPagina;
