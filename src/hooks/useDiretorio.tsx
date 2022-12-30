import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { FaReddit } from "react-icons/fa";
import { useRecoilState, useRecoilValue } from "recoil";
import { comunidadeState } from "../atoms/comunidadesAtom";
import {
  defaultMenuItem,
  DiretorioMenuItem,
  diretorioMenuState,
} from "../atoms/diretorioMenuAtom";

const useDiretorio = () => {
  const [diretorioState, setDiretorioState] =
    useRecoilState(diretorioMenuState);
  const router = useRouter();

  const comunidadeStateValue = useRecoilValue(comunidadeState);

  const onSelectMenuItem = (menuItem: DiretorioMenuItem) => {
    setDiretorioState((prev) => ({
      ...prev,
      selecionadoMenuItem: menuItem,
    }));
    router?.push(menuItem.link);
    if (diretorioState.isOpen) {
      toggleMenuOpen();
    }
  };

  const toggleMenuOpen = () => {
    setDiretorioState((prev) => ({
      ...prev,
      isOpen: !diretorioState.isOpen,
    }));
  };

  /*   useEffect(() => {
    const { comunidade } = router.query;

    // const comunidadeExistente =
    //   communityStateValue.visitedCommunities[community as string];

    const comunidadeExistente = comunidadeStateValue.comunidadeAtual;

    if (comunidadeExistente?.id) {
      setDiretorioState((prev) => ({
        ...prev,
        selectedMenuItem: {
          displayText: `r/${comunidadeExistente.id}`,
          link: `r/${comunidadeExistente.id}`,
          icon: FaReddit,
          iconColor: "blue.500",
          imageURL: comunidadeExistente.imageURL,
        },
      }));
      return;
    }
    setDiretorioState((prev) => ({
      ...prev,
      selectedMenuItem: defaultMenuItem,
    }));
  }, [comunidadeStateValue.comunidadeAtual]);
  //                              ^ used to be communityStateValue.vistedCommunities
 */
  return { diretorioState, toggleMenuOpen, onSelectMenuItem };
};
export default useDiretorio;
