import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { autenticacaoModalState } from "../atoms/autenticacaoModalAtom";
import { comunidadeState } from "../atoms/comunidadesAtom";
import { Post, postState, PostVote } from "../atoms/postAtom";
import {
  autenticacaoFirebase,
  firestore,
  storageFirebase,
} from "../firebase/clientApp";

const usePosts = () => {
  const [user] = useAuthState(autenticacaoFirebase);
  const router = useRouter();
  const [postStateValue, setPostStateValue] = useRecoilState(postState);
  const currentComunidade = useRecoilValue(comunidadeState).comunidadeAtual;
  const setAutenticacaoModalState = useSetRecoilState(autenticacaoModalState);
  const onVote = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    vote: number,
    comunidadeId: string
  ) => {
    event.stopPropagation();
    // checar por um usuario se não abrir modal auth

    if (!user?.uid) {
      setAutenticacaoModalState({ open: true, view: "login" });
      return;
    }

    try {
      const { voteStatus } = post;
      const voteExistente = postStateValue.postVotes.find(
        (vote) => vote.postId === post.id
      );

      const batch = writeBatch(firestore);
      const updatedPost = { ...post };
      const updatedPosts = [...postStateValue.posts];
      let updatedPostsVotes = [...postStateValue.postVotes];
      let voteChange = vote; // decidir se vamos de like ou dislike

      // novo voto
      if (!voteExistente) {
        // adicionar ou subrair 1 para o post.voteStatus
        const postVoteRef = doc(
          collection(firestore, "users", `${user?.uid}/postVotes`)
        );

        const novoVoto: PostVote = {
          id: postVoteRef.id,
          postId: post.id,
          comunidadeId,
          voteValue: vote,
        };
        batch.set(postVoteRef, novoVoto);
        // adicionar 1 para o post votes
        /*     console.log("updatepost aq", updatedPosts);
        console.log("postStateValue aq", postStateValue);
        console.log("updatepostvotes aq", updatedPostsVotes);
        console.log("updatepostvotes novo voto", [
          ...updatedPostsVotes,
          novoVoto,
        ]); */
        updatedPost.voteStatus = voteStatus + vote;
        updatedPostsVotes = [...updatedPostsVotes, novoVoto];

        /* await batch.commit */
      } else {
        // voto já existente no post
        const postVoteRef = doc(
          firestore,
          "users",
          `${user?.uid}/postVotes/${voteExistente.id}`
        );

        //removendo o voto, indo de algum voto para nenhum voto
        if (voteExistente.voteValue === vote) {
          //adicionar ou subtrair para o post.voteStatus
          updatedPost.voteStatus = voteStatus - vote;
          updatedPostsVotes = updatedPostsVotes.filter(
            (vote) => vote.id !== voteExistente.id
          );

          // deletar o postVote com informações do voto do document na firebas
          batch.delete(postVoteRef);

          voteChange *= -1;
        } else {
          // trocando seus votos pelo contrario
          voteChange = 2 * vote;
          updatedPost.voteStatus = voteStatus + 2 * vote;

          const voteIdx = postStateValue.postVotes.findIndex(
            (vote) => vote.id === voteExistente.id
          );
          if (voteIdx !== -1) {
            updatedPostsVotes[voteIdx] = {
              ...voteExistente,
              voteValue: vote,
            };
          }

          //update postVote document já existente
          batch.update(postVoteRef, {
            voteValue: vote,
          });
        }
      }

      //update rcoil state dos votos
      const postIdx = postStateValue.posts.findIndex(
        (item) => item.id === post.id
      );
      updatedPosts[postIdx] = updatedPost;
      setPostStateValue((prev) => ({
        ...prev,
        posts: updatedPosts,
        postVotes: updatedPostsVotes,
      }));

      if (postStateValue.selecionadoPost) {
        setPostStateValue((prev) => ({
          ...prev,
          selecionadoPost: updatedPost,
        }));
      }

      //update nosso post document
      const postRef = doc(firestore, "posts", post.id);
      batch.update(postRef, { voteStatus: voteStatus + voteChange });

      await batch.commit();
    } catch (error) {
      console.log("onvote error", error);
    }
  };
  const onSelectPost = (post: Post) => {
    setPostStateValue((prev) => ({
      ...prev,
      selecionadoPost: post,
    }));
    router.push(`/r/${post.comunidadeId}/comentarios/${post.id}`);
  };
  const onDeletPost = async (post: Post): Promise<boolean> => {
    try {
      //checar se post contém uma imagem, deletar se existir
      if (post.imageURL) {
        const imageRef = ref(storageFirebase, `posts${post.id}/image`);
        await deleteObject(imageRef);
      }
      //deletar post doc da firestore
      const postDocRef = doc(firestore, "posts", post.id!);
      await deleteDoc(postDocRef);
      // update recoil state

      setPostStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter((item) => item.id !== post.id),
      }));
      return true;
    } catch (error) {
      console.log("error ondeletpost", error);
      return false;
    }
  };

  const getComunidadePostVotes = async (comunidadeId: string) => {
    const postVotesQuery = query(
      collection(firestore, "users", `${user?.uid}/postVotes`),
      where("comunidadeId", "==", comunidadeId)
    );

    const postVoteDocs = await getDocs(postVotesQuery);
    const postVotes = postVoteDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setPostStateValue((prev) => ({
      ...prev,
      postVotes: postVotes as PostVote[],
    }));
  };

  useEffect(() => {
    if (!user || !currentComunidade?.id) return;
    getComunidadePostVotes(currentComunidade?.id);
  }, [user, currentComunidade]);

  useEffect(() => {
    if (!user) {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }));
    }
  }, [user]);

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletPost,
  };
};
export default usePosts;
