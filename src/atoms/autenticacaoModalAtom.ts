import { atom } from "recoil";

export interface AutenticacaoModalState {
  open: boolean;
  view: "login" | "registrar" | "resetPassword";
}

const defaultModalState: AutenticacaoModalState = {
  open: false,
  view: "login",
};

export const autenticacaoModalState = atom<AutenticacaoModalState>({
  key: "AutenticacaoModalState",
  default: defaultModalState,
});
