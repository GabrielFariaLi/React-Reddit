import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React from "react";
import { Comunidade } from "../../../atoms/comunidadesAtom";
import { firestore } from "../../../firebase/clientApp";
import safeJsonStringify from "safe-json-stringify";
import ComunidadeNotFound from "../../../components/Comunidade/ComunidadeNotFound";
import Header from "../../../components/Comunidade/Header";
import ConteudoPagina from "../../../components/Layout/ConteudoPagina";

type PaginaComunidadeProps = {
  comunidadeData: Comunidade;
};

const PaginaComunidade: React.FC<PaginaComunidadeProps> = (props) => {
  console.log("data aq", props.comunidadeData);

  if (!props.comunidadeData) {
    return <ComunidadeNotFound />;
  }
  return (
    <>
      <Header comunidadeData={props.comunidadeData} />
      <ConteudoPagina>
        <>
          <div>ESQUERDA</div>
        </>
        <>
          <div>DIREITA</div>
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
