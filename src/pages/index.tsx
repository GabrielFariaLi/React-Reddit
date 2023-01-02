import { Stack } from "@chakra-ui/react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";
import { comunidadeState } from "../atoms/comunidadesAtom";
import { Post, PostVote } from "../atoms/postAtom";
import LinkCriarPostComunidade from "../components/Comunidade/LinkCriarPostComunidade";
import PersonalHome from "../components/Comunidade/PersonalHome";
import Premium from "../components/Comunidade/Premium";
import Recomendacoes from "../components/Comunidade/Recomendacoes";
import ConteudoPagina from "../components/Layout/ConteudoPagina";
import PostItem from "../components/Posts/PostItem";
import PostLoader from "../components/Posts/PostLoader";
import { autenticacaoFirebase, firestore } from "../firebase/clientApp";
import useComunidadeData from "../hooks/useComunidadeData";
import usePosts from "../hooks/usePosts";

const Home: NextPage = () => {
  const [user, loadingUser] = useAuthState(autenticacaoFirebase);
  const [loading, setLoading] = useState(false);
  const {
    setPostStateValue,
    postStateValue,
    onSelectPost,
    onDeletPost,
    onVote,
  } = usePosts();
  const { comunidadeStateValue } = useComunidadeData();

  const buildUserHomeFeed = async () => {
    // get posts das comunidades do usuario
    setLoading(true);
    try {
      if (comunidadeStateValue.mySnippets.length) {
        const userComunidadeIds = comunidadeStateValue.mySnippets.map(
          (snippet) => snippet.comunidadeId
        );
        const postQuery = query(
          collection(firestore, "posts"),
          where("comunidadeId", "in", userComunidadeIds),
          limit(30)
        );
        const postDocs = await getDocs(postQuery);
        const posts = postDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPostStateValue((prev) => ({
          ...prev,
          posts: posts as Post[],
        }));
      } else {
        buildNoUserHomeFeed();
      }
    } catch (error) {
      console.log("builduserhomefeed error", error);
    }
    setLoading(false);
  };
  const buildNoUserHomeFeed = async () => {
    setLoading(true);
    try {
      const postQuery = query(
        collection(firestore, "posts"),
        orderBy("voteStatus", "desc"),
        limit(30)
      );
      const postDocs = await getDocs(postQuery);
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
    } catch (error) {
      console.log("buildNoUserhomefeed error", error);
    }
    setLoading(false);
  };
  const getUserPostVotes = async () => {
    try {
      const postIds = postStateValue.posts.map((post) => post.id);
      const postVotesQuery = query(
        collection(firestore, `users/${user?.uid}/postVotes`),
        where("postId", "in", postIds)
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
    } catch (error) {
      console.log("getuserpostvotes error", error);
    }
  };

  useEffect(() => {
    //console.log("teste fetched ", comunidadeStateValue.snippetsFetched);
    if (comunidadeStateValue.snippetsFetched) buildUserHomeFeed();
  }, [comunidadeStateValue.snippetsFetched]);
  useEffect(() => {
    if (!user && !loadingUser) buildNoUserHomeFeed();
  }, [user, loadingUser]);

  useEffect(() => {
    if (user && postStateValue.posts.length) getUserPostVotes();
    return () => {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }));
    };
  }, [user, postStateValue.posts]);
  return (
    <ConteudoPagina>
      <>
        <LinkCriarPostComunidade />
        {loading ? (
          <PostLoader />
        ) : (
          <Stack>
            {postStateValue.posts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                onSelectPost={onSelectPost}
                onDeletePost={onDeletPost}
                onVote={onVote}
                userVoteValue={
                  postStateValue.postVotes.find(
                    (item) => item.postId === post.id
                  )?.voteValue
                }
                userIsCreator={user?.uid === post.criadorId}
                homePage
              />
            ))}
          </Stack>
        )}
      </>
      <>
        <Stack spacing={5}>
          <Recomendacoes />
          <Premium />
          <PersonalHome />
        </Stack>
      </>
    </ConteudoPagina>
  );
};

export default Home;
