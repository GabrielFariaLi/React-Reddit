import { Stack } from "@chakra-ui/react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Comunidade } from "../../atoms/comunidadesAtom";
import { Post, postState } from "../../atoms/postAtom";
import { autenticacaoFirebase, firestore } from "../../firebase/clientApp";
import usePosts from "../../hooks/usePosts";
import PostItem from "./PostItem";
import PostLoader from "./PostLoader";

type PostsProps = {
  comunidadeData: Comunidade;
};

const Posts: React.FC<PostsProps> = (props) => {
  //user
  const [user] = useAuthState(autenticacaoFirebase);

  const [loading, setLoading] = useState(false);
  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletPost,
  } = usePosts();
  const getPosts = async () => {
    setLoading(true);
    try {
      // get posts para a comunidade
      const postsQuery = query(
        collection(firestore, "posts"),
        where("comunidadeId", "==", props.comunidadeData.id),
        orderBy("createdAt", "desc")
      );
      const postDocs = await getDocs(postsQuery);
      // GUARDAR TODOS OS POSTS NO NOSSO POST STATE
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log("posts data aq", posts);
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
    } catch (error: any) {
      console.log("getpost error,", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getPosts();
  }, [props.comunidadeData]);
  return (
    <>
      {loading ? (
        <PostLoader />
      ) : (
        <Stack>
          {postStateValue.posts.map((item) => (
            <PostItem
              key={item.id}
              post={item}
              userIsCreator={user?.uid === item.criadorId}
              userVoteValue={
                postStateValue.postVotes.find((vote) => vote.postId === item.id)
                  ?.voteValue
              }
              onVote={onVote}
              onSelectPost={onSelectPost}
              onDeletePost={onDeletPost}
            />
          ))}
        </Stack>
      )}
    </>
  );
};
export default Posts;
