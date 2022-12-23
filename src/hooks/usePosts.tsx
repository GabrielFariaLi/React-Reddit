import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React from "react";
import { useRecoilState } from "recoil";
import { Post, postState } from "../atoms/postAtom";
import { firestore, storageFirebase } from "../firebase/clientApp";

const usePosts = () => {
  const [postStateValue, setPostStateValue] = useRecoilState(postState);

  const onVote = async () => {};
  const onSelectPost = () => {};
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

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletPost,
  };
};
export default usePosts;
