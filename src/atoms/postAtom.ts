import { Timestamp } from "@google-cloud/firestore";
import { atom } from "recoil";

export type Post = {
  id: string;
  comunidadeId: string;
  criadorId: string;
  criadorDisplayName: string;
  titulo: string;
  body: string;
  numberOfComments: number;
  voteStatus: number;
  imageURL?: string;
  comunidadeImagemURL?: string;
  createdAt: Timestamp;
};

interface PostState {
  selecionadoPost: Post | null;
  posts: Post[];
  //postVotes
}

const defaultPostState: PostState = {
  selecionadoPost: null,
  posts: [],
};

export const postState = atom<PostState>({
  key: "postState",
  default: defaultPostState,
});
