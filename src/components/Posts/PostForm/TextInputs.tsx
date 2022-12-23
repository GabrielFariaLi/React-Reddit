import { Button, Flex, Input, Stack, Textarea } from "@chakra-ui/react";
import React from "react";

type TextInputsProps = {
  textInputs: {
    titulo: string;
    body: string;
  };
  loading: boolean;

  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleCriarPost: () => void;
};

const TextInputs: React.FC<TextInputsProps> = (props) => {
  return (
    <Stack spacing={3} width="100%">
      <Input
        name="titulo"
        value={props.textInputs.titulo}
        onChange={props.onChange}
        fontSize="10pt"
        borderRadius={4}
        placeholder="Título"
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "black",
        }}
      />
      <Textarea
        name="body"
        height={"100px"}
        value={props.textInputs.body}
        onChange={props.onChange}
        fontSize="10pt"
        borderRadius={4}
        placeholder="Texto (opcional)"
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "black",
        }}
      />
      <Flex justify={"flex-end"}>
        <Button
          height={"34px"}
          padding="0px 30px"
          disabled={!props.textInputs.titulo}
          onClick={props.handleCriarPost}
          isLoading={props.loading}
        >
          Post
        </Button>
      </Flex>
    </Stack>
  );
};
export default TextInputs;
