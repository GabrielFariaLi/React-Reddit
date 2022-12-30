import { Flex, Textarea, Button, Text } from "@chakra-ui/react";
import { User } from "firebase/auth";
import React from "react";
import AutenticacaoButtons from "../../Navbar/ConteudoDireita/AutenticacaoButtons";

type ComentarioInputProps = {
  comentarioText: string;
  setComentarioText: (value: string) => void;
  user: User;
  createLoading: boolean;
  onCreateComentario: (comentarioText: string) => void;
};

const ComentarioInput: React.FC<ComentarioInputProps> = (props) => {
  return (
    <Flex direction="column" position="relative">
      {props.user ? (
        <>
          <Text mb={1}>
            Comente como u/{" "}
            <span style={{ color: "#3182CE" }}>
              {props.user?.email?.split("@")[0]}
            </span>
          </Text>
          <Textarea
            value={props.comentarioText}
            onChange={(event) => props.setComentarioText(event.target.value)}
            placeholder="Quais são seus pensamentos?"
            fontSize="10pt"
            borderRadius={4}
            minHeight="160px"
            pb={10}
            _placeholder={{ color: "gray.500" }}
            _focus={{
              outline: "none",
              bg: "white",
              border: "1px solid black",
            }}
          />
          <Flex
            position="absolute"
            left="1px"
            right={0.1}
            bottom="1px"
            justify="flex-end"
            bg="gray.100"
            p="6px 8px"
            borderRadius="0px 0px 4px 4px"
          >
            <Button
              height="26px"
              disabled={!props.comentarioText.length}
              isLoading={props.createLoading}
              onClick={() => props.onCreateComentario(props.comentarioText)}
            >
              Comente
            </Button>
          </Flex>
        </>
      ) : (
        <Flex
          align="center"
          justify="space-between"
          borderRadius={2}
          border="1px solid"
          borderColor="gray.100"
          p={4}
        >
          <Text fontWeight={600}>
            Log-se ou registre-se para deixar um comentario!
          </Text>
          <AutenticacaoButtons />
        </Flex>
      )}
    </Flex>
  );
};
export default ComentarioInput;
