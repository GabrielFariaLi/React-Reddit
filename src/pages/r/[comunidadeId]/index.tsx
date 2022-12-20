import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React from "react";
import { Comunidade } from "../../../atoms/comunidadesAtom";
import { firestore } from "../../../firebase/clientApp";
import safeJsonStringify from "safe-json-stringify";

type PaginaComunidadeProps = {
  comunidadeData: Comunidade;
};

const PaginaComunidade: React.FC<PaginaComunidadeProps> = (props) => {
  console.log("data aq", props.comunidadeData);

  if (!props.comunidadeData) {
    return <div>comunidade nao existe</div>;
  }
  return <div>BEM VINDO A {props.comunidadeData.id}</div>;
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
