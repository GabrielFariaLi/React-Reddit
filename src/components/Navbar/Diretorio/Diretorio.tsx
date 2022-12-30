import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Flex,
  Menu,
  MenuButton,
  MenuList,
  Text,
  Icon,
  Image,
} from "@chakra-ui/react";
import React from "react";
import { useSetRecoilState } from "recoil";
import { TiHome } from "react-icons/ti";
import { autenticacaoModalState } from "../../../atoms/autenticacaoModalAtom";
import Comunidades from "./Comunidades";
import useDiretorio from "../../../hooks/useDiretorio";

const Diretorio: React.FC = (props) => {
  const { diretorioState, toggleMenuOpen } = useDiretorio();
  const setAutenticacaoModalState = useSetRecoilState(autenticacaoModalState);
  return (
    <Menu isOpen={diretorioState.isOpen}>
      <MenuButton
        cursor="pointer"
        padding="0px 6px"
        borderRadius={4}
        mr={2}
        ml={{ base: 0, md: 2 }}
        _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
        onClick={toggleMenuOpen}
      >
        {" "}
        <Flex
          align="center"
          justify="space-between"
          width={{ base: "auto", lg: "200px" }}
        >
          <Flex align="center">
            {diretorioState.selecionadoMenuItem.imageURL ? (
              <Image
                src={diretorioState.selecionadoMenuItem.imageURL}
                borderRadius="full"
                boxSize="24px"
                mr={2}
              />
            ) : (
              <Icon
                fontSize={24}
                mr={{ base: 1, md: 2 }}
                as={diretorioState.selecionadoMenuItem.icon}
                color={diretorioState.selecionadoMenuItem.iconColor}
              />
            )}
            <Flex display={{ base: "none", lg: "flex" }}>
              <Text fontWeight={600} fontSize="10pt">
                {diretorioState.selecionadoMenuItem.displayText}
              </Text>
            </Flex>
          </Flex>
          <ChevronDownIcon />
        </Flex>
      </MenuButton>
      <MenuList>
        <Comunidades />
      </MenuList>
    </Menu>
  );
};
export default Diretorio;
