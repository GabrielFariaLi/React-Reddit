import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Post } from "../../../../atoms/postAtom";
import SobreComunidade from "../../../../components/Comunidade/SobreComunidade";
import ConteudoPagina from "../../../../components/Layout/ConteudoPagina";
import Comentarios from "../../../../components/Posts/Comentarios/Comentarios";
import PostItem from "../../../../components/Posts/PostItem";
import {
  autenticacaoFirebase,
  firestore,
} from "../../../../firebase/clientApp";
import useComunidadeData from "../../../../hooks/useComunidadeData";
import usePosts from "../../../../hooks/usePosts";

const PaginaPost: React.FC = () => {
  const [user] = useAuthState(autenticacaoFirebase);
  const { postStateValue, setPostStateValue, onDeletPost, onVote } = usePosts();
  const router = useRouter();
  const { comunidadeStateValue } = useComunidadeData();
  const fetchPost = async (postId: string) => {
    try {
      const postDocRef = doc(firestore, "posts", postId);
      const postDoc = await getDoc(postDocRef);
      setPostStateValue((prev) => ({
        ...prev,
        selecionadoPost: { id: postDoc.id, ...postDoc.data() } as Post,
      }));
    } catch (error) {
      console.log("fetch post errro", error);
    }
  };

  useEffect(() => {
    const { pId } = router.query;
    if (pId && !postStateValue.selecionadoPost) {
      fetchPost(pId as string);
    }
  }, [router.query, postStateValue.selecionadoPost]);
  return (
    <ConteudoPagina>
      <>
        {postStateValue.selecionadoPost && (
          <PostItem
            post={postStateValue.selecionadoPost}
            onVote={onVote}
            onDeletePost={onDeletPost}
            userVoteValue={
              postStateValue.postVotes.find(
                (item) => item.postId === postStateValue.selecionadoPost?.id
              )?.voteValue
            }
            userIsCreator={
              user?.uid === postStateValue.selecionadoPost?.criadorId
            }
          />
        )}
        <Comentarios
          user={user as User}
          selecionadoPost={postStateValue.selecionadoPost}
          comunidadeId={postStateValue.selecionadoPost?.comunidadeId as string}
        />
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
export default PaginaPost;
