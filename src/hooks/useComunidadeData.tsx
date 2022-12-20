import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";
import { Comunidade, comunidadeState } from "../atoms/comunidadesAtom";
import { autenticacaoFirebase, firestore } from "../firebase/clientApp";

const useComunidadeData = () => {
  const [user] = useAuthState(autenticacaoFirebase);
  const [comunidadeStateValue, setComunidadeStateValue] =
    useRecoilState(comunidadeState);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onJoinOrLeaveComunidade = (
    comunidadeData: Comunidade,
    isJoined: boolean
  ) => {
    //usuario está logado?
    // abrir modal autenticacao
    if (isJoined) {
      leaveComunidade(comunidadeData.id);
      return;
    }
  };
  const getMySnippets = async () => {
    setLoading(true);
    try {
      const snippetDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/snippetComunidade`)
      );

      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));
      console.log("snippets aq", snippets);
    } catch (error) {
      console.log("getmysnippets error", error);
    }
  };
  const joinComunidade = (comunidadeData: Comunidade) => {};
  const leaveComunidade = (comunidadeData: string) => {};

  useEffect(() => {
    if (!user) return;
    getMySnippets();
  }, [user]);

  return {
    //data funcoes
    comunidadeStateValue,
    onJoinOrLeaveComunidade,
  };
};
export default useComunidadeData;
