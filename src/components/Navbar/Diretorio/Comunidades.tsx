import { MenuItem, Flex, Icon } from "@chakra-ui/react";
import React, { useState } from "react";
import CriarComunidadeModal from "../../Modal/CriarComunidade/CriarComunidadeModal";
import { GrAdd } from "react-icons/gr";
type ComunidadesProps = {};

const Comunidades: React.FC<ComunidadesProps> = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <CriarComunidadeModal open={open} handleClose={() => setOpen(false)} />
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
    </>
  );
};
export default Comunidades;
