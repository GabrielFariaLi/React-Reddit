import { SearchIcon } from "@chakra-ui/icons";
import { Flex, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { User } from "firebase/auth";
import React from "react";

type InputBuscaProps = {
  user?: User | null;
};

const InputBusca: React.FC<InputBuscaProps> = (props) => {
  return (
    <Flex
      flexGrow={1}
      maxWidth={props.user ? "auto" : "600px"}
      mr={2}
      align="center"
    >
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<SearchIcon color="gray.400" mb={1} />}
        />
        <Input
          placeholder="Busque no Reddit"
          fontSize="10pt"
          _placeholder={{ color: "gray.500" }}
          _hover={{ bg: "hite", border: "1px solid", borderColor: "blue.500" }}
          _focus={{
            outline: "none",
            border: "1px solid",
            borderColor: "blue.500",
          }}
        />
      </InputGroup>
    </Flex>
  );
};
export default InputBusca;
