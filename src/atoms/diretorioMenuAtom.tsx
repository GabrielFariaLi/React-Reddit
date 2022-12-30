import { IconType } from "react-icons/lib";
import { TiHome } from "react-icons/ti";
import { atom } from "recoil";

export type DiretorioMenuItem = {
  displayText: string;
  link: string;
  icon: IconType;
  iconColor: string;
  imageURL?: string;
};

interface DiretorioMenuState {
  isOpen: boolean;
  selecionadoMenuItem: DiretorioMenuItem;
}
export const defaultMenuItem: DiretorioMenuItem = {
  displayText: "Home",
  link: "/",
  icon: TiHome,
  iconColor: "black",
};

export const defaultMenuState: DiretorioMenuState = {
  isOpen: false,
  selecionadoMenuItem: defaultMenuItem,
};

export const diretorioMenuState = atom<DiretorioMenuState>({
  key: "diretorioMenuState",
  default: defaultMenuState,
});
