import { Timestamp } from "@google-cloud/firestore";
import { atom } from "recoil";

export interface Comunidade {
  id: string;
  creatorId: string;
  numberOfMembers: number;
  privacyType: "publico" | "restrito" | "privado";
  createdAt?: Timestamp;
  imageURL?: string;
}

export interface SnippetComunidade {
  comunidadeId: string;
  isModerator?: boolean;
  imageURL?: string;
}
interface ComunidadeState {
  mySnippets: SnippetComunidade[];
  comunidadeAtual?: Comunidade;
}

export const defaultComunidadeState: ComunidadeState = {
  mySnippets: [],
};

export const comunidadeState = atom<ComunidadeState>({
  key: "ComunidadesDataState",
  default: defaultComunidadeState,
});
