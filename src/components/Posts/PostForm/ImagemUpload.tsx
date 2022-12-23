import { Button, Flex, Image, Stack } from "@chakra-ui/react";
import React, { useRef } from "react";

type ImagemUploadProps = {
  selecionadoFile?: string;
  onSelecionarImagem: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setTabSelecionado: (value: string) => void;
  setSelecionadoFile: (value: string) => void;
};

const ImagemUpload: React.FC<ImagemUploadProps> = (props) => {
  const selecionadoFileRef = useRef<HTMLInputElement>(null);

  return (
    <Flex direction={"column"} justify={"center"} align="center" width={"100%"}>
      {props.selecionadoFile ? (
        <>
          <Image
            src={props.selecionadoFile}
            maxWidth="400px"
            maxHeight={"400px"}
          />
          <Stack direction={"row"} mt={4}>
            <Button
              height={"28px"}
              onClick={() => props.setTabSelecionado("Post")}
            >
              Voltar para o Post
            </Button>
            <Button
              variant={"outline"}
              height="28px"
              onClick={() => props.setSelecionadoFile("")}
            >
              Remover
            </Button>
          </Stack>
        </>
      ) : (
        <Flex
          justify={"center"}
          align="center"
          p={20}
          border="1px dashed"
          borderColor={"gray.200"}
          width="100%"
          borderRadius={4}
        >
          <Button
            variant={"outline"}
            height="28px"
            onClick={() => selecionadoFileRef.current?.click()}
          >
            Upload
          </Button>
          <input
            ref={selecionadoFileRef}
            type="file"
            hidden
            onChange={props.onSelecionarImagem}
          />
        </Flex>
      )}
    </Flex>
  );
};
export default ImagemUpload;
