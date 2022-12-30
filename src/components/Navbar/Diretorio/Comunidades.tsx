import { MenuItem, Flex, Icon, Text, Box } from "@chakra-ui/react";
import React, { useState } from "react";
import CriarComunidadeModal from "../../Modal/CriarComunidade/CriarComunidadeModal";
import { GrAdd } from "react-icons/gr";
import { comunidadeState } from "../../../atoms/comunidadesAtom";
import { useRecoilValue } from "recoil";
import MenuListItem from "./MenuListItem";
import { FaReddit } from "react-icons/fa";
type ComunidadesProps = {};

const Comunidades: React.FC<ComunidadesProps> = () => {
  const [open, setOpen] = useState(false);
  const mySnippets = useRecoilValue(comunidadeState).mySnippets;
  return (
    <>
      <CriarComunidadeModal open={open} handleClose={() => setOpen(false)} />
      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
          {" "}
          MODERANDO
        </Text>

        {mySnippets
          .filter((snippet) => snippet.isModerator)
          .map((snippet) => (
            <MenuListItem
              key={snippet.comunidadeId}
              icon={FaReddit}
              displayText={`r/${snippet.comunidadeId}`}
              link={`/r/${snippet.comunidadeId}`}
              iconColor="brand.100"
              imageURL={snippet.imageURL}
            />
          ))}
      </Box>
      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
          {" "}
          MINHAS COMUNIDADES
        </Text>

        <MenuItem
          width="100%"
          fontSize="10pt"
          _hover={{ bg: "gray.100" }}
          onClick={() => setOpen(true)}
        >
          <Flex align="center">
            <Icon fontSize={20} mr={2} as={GrAdd} />
            Criar Comunidade
          </Flex>
        </MenuItem>

        {mySnippets.map((snippet) => (
          <MenuListItem
            key={snippet.comunidadeId}
            icon={FaReddit}
            displayText={`r/${snippet.comunidadeId}`}
            link={`/r/${snippet.comunidadeId}`}
            iconColor="blue.500"
            imageURL={snippet.imageURL}
          />
        ))}
      </Box>
    </>
  );
};
export default Comunidades;
