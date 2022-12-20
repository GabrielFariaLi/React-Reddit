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
