import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  writeBatch,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";
import { autenticacaoModalState } from "../atoms/autenticacaoModalAtom";
import {
  Comunidade,
  comunidadeState,
  SnippetComunidade,
} from "../atoms/comunidadesAtom";
import { autenticacaoFirebase, firestore } from "../firebase/clientApp";

const useComunidadeData = () => {
  const [user] = useAuthState(autenticacaoFirebase);
  const [comunidadeStateValue, setComunidadeStateValue] =
    useRecoilState(comunidadeState);
  const setAutenticacaoModalState = useSetRecoilState(autenticacaoModalState);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onJoinOrLeaveComunidade = (
    comunidadeData: Comunidade,
    isJoined: boolean
  ) => {
    //usuario está logado?
    if (!user) {
      setAutenticacaoModalState({ open: true, view: "login" });
      return;
    }
    // abrir modal autenticacao
    if (isJoined) {
      leaveComunidade(comunidadeData.id);
      return;
    }
    joinComunidade(comunidadeData);
  };
  const getMySnippets = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const snippetDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/snippetComunidade`)
      );

      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));
      console.log("snippets aq", snippets);
      setComunidadeStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as SnippetComunidade[],
        snippetsFetched: true,
      }));
    } catch (error: any) {
      console.log("getmysnippets error", error);
      setError(error.message);
    }
    setLoading(false);
  };
  const joinComunidade = async (comunidadeData: Comunidade) => {
    // batch para so escrever
    // criar nova comunidade snippet para utilizador que decidiu se juntar
    //setLoading(true);
    try {
      const batch = writeBatch(firestore);
      let newSnippet: SnippetComunidade = {
        comunidadeId: comunidadeData.id,
        isModerator: user?.uid === comunidadeData.creatorId,
      };
      if (comunidadeData.imageURL) {
        newSnippet = {
          comunidadeId: comunidadeData.id,
          imageURL: comunidadeData?.imageURL,
          isModerator: user?.uid === comunidadeData.creatorId,
        };
      }

      batch.set(
        doc(
          firestore,
          `users/${user?.uid}/snippetComunidade`,
          comunidadeData.id
        ),
        newSnippet
      );
      // update no numero de membros na comunidade
      batch.update(doc(firestore, `comunidades`, comunidadeData.id), {
        numberOfMembers: increment(1),
      });

      await batch.commit();

      //update recoil state
      setComunidadeStateValue((prev) => ({
        ...prev,
        mySnippets: [...prev.mySnippets, newSnippet],
      }));
    } catch (error: any) {
      console.log("join comunidade errorr", error);
      setError(error.message);
    }
    setLoading(false);
  };
  const leaveComunidade = async (comunidadeId: string) => {
    try {
      const batch = writeBatch(firestore);

      batch.delete(
        doc(firestore, `users/${user?.uid}/snippetComunidade`, comunidadeId)
      );

      // update no numero de membros na comunidade
      batch.update(doc(firestore, `comunidades`, comunidadeId), {
        numberOfMembers: increment(-1),
      });

      await batch.commit();

      //update recoil state
      setComunidadeStateValue((prev) => ({
        ...prev,
        mySnippets: prev.mySnippets.filter(
          (item) => item.comunidadeId !== comunidadeId
        ),
      }));
    } catch (error: any) {
      console.log("leave comunidade error", error);
      setError(error.message);
    }
  };

  const getComunidadeData = async (comunidadeId: string) => {
    try {
      const comunidadeDocRef = doc(firestore, "comunidades", comunidadeId);
      const comunidadeDoc = await getDoc(comunidadeDocRef);
      setComunidadeStateValue((prev) => ({
        ...prev,
        comunidadeAtual: {
          id: comunidadeDoc.id,
          ...comunidadeDoc.data(),
        } as Comunidade,
      }));
    } catch (error) {
      console.log("get comunidade data errro", error);
    }
  };

  useEffect(() => {
    if (!user) {
      setComunidadeStateValue((prev) => ({
        ...prev,
        mySnippets: [],
        snippetsFetched: false,
      }));
    }
    getMySnippets();
  }, [user]);

  useEffect(() => {
    const { comunidadeId } = router.query;

    if (comunidadeId && !comunidadeStateValue.comunidadeAtual) {
      getComunidadeData(comunidadeId as string);
    }
  }, [router.query, comunidadeStateValue.comunidadeAtual]);

  return {
    //data funcoes
    comunidadeStateValue,
    onJoinOrLeaveComunidade,
    loading,
  };
};
export default useComunidadeData;
