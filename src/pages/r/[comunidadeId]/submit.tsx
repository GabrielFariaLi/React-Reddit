import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";
import { comunidadeState } from "../../../atoms/comunidadesAtom";
import SobreComunidade from "../../../components/Comunidade/SobreComunidade";
import ConteudoPagina from "../../../components/Layout/ConteudoPagina";
import FormCriarPost from "../../../components/Posts/FormCriarPost";
import { autenticacaoFirebase } from "../../../firebase/clientApp";
import useComunidadeData from "../../../hooks/useComunidadeData";

const submitPostPagina: React.FC = () => {
  const [user] = useAuthState(autenticacaoFirebase);
  //const comunidadeStateValue = useRecoilValue(comunidadeState);

  const { comunidadeStateValue } = useComunidadeData();
  console.log("comunidadeState", comunidadeStateValue);

  return (
    <ConteudoPagina>
      <>
        <Box p="14px 0px" borderBottom={"1px solid"} borderColor="white">
          <Text>Criar um post</Text>
          {user && (
            <FormCriarPost
              user={user}
              comunidadeImagemURL={
                comunidadeStateValue.comunidadeAtual?.imageURL
              }
            />
          )}
        </Box>
      </>
      <>
        {comunidadeStateValue.comunidadeAtual && (
          <SobreComunidade
            comunidadeData={comunidadeStateValue.comunidadeAtual}
          />
        )}
      </>
    </ConteudoPagina>
  );
};
export default submitPostPagina;
