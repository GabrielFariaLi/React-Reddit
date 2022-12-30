import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React, { useEffect } from "react";
import { Comunidade, comunidadeState } from "../../../atoms/comunidadesAtom";
import { firestore } from "../../../firebase/clientApp";
import safeJsonStringify from "safe-json-stringify";
import ComunidadeNotFound from "../../../components/Comunidade/ComunidadeNotFound";
import Header from "../../../components/Comunidade/Header";
import ConteudoPagina from "../../../components/Layout/ConteudoPagina";
import LinkCriarPostComunidade from "../../../components/Comunidade/LinkCriarPostComunidade";
import Posts from "../../../components/Posts/Posts";
import { useSetRecoilState } from "recoil";
import SobreComunidade from "../../../components/Comunidade/SobreComunidade";

type PaginaComunidadeProps = {
  comunidadeData: Comunidade;
};

const PaginaComunidade: React.FC<PaginaComunidadeProps> = (props) => {
  console.log("data aq", props.comunidadeData);
  const setComunidadeStateValue = useSetRecoilState(comunidadeState);
  if (!props.comunidadeData) {
    return <ComunidadeNotFound />;
  }

  useEffect(() => {
    setComunidadeStateValue((prev) => ({
      ...prev,
      comunidadeAtual: props.comunidadeData,
    }));
  }, [props.comunidadeData]);
  return (
    <>
      <Header comunidadeData={props.comunidadeData} />
      <ConteudoPagina>
        <>
          <LinkCriarPostComunidade />
          <Posts comunidadeData={props.comunidadeData} />
        </>
        <>
          <SobreComunidade comunidadeData={props.comunidadeData} />
        </>
      </ConteudoPagina>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const comunidadeDocRef = doc(
      firestore,
      "comunidades",
      context.query.comunidadeId as string
    );
    const comunidadeDoc = await getDoc(comunidadeDocRef);
    return {
      props: {
        comunidadeData: comunidadeDoc.exists()
          ? JSON.parse(
              safeJsonStringify({
                id: comunidadeDoc.id,
                ...comunidadeDoc.data(),
              })
            )
          : "",
      },
    };
  } catch (error) {
    // TODO: adicionar pagina de error
    console.log("getServerSideProps error", error);
  }
}
export default PaginaComunidade;
