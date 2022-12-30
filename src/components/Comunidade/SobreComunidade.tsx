import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Image,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import moment from "moment";
import Link from "next/link";

import React, { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaReddit } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiCakeLine } from "react-icons/ri";
import { useSetRecoilState } from "recoil";
import { Comunidade, comunidadeState } from "../../atoms/comunidadesAtom";
import {
  autenticacaoFirebase,
  firestore,
  storageFirebase,
} from "../../firebase/clientApp";
import useSelectFile from "../../hooks/useSelectFile";

type SobreComunidadeProps = {
  comunidadeData: Comunidade;
};

const SobreComunidade: React.FC<SobreComunidadeProps> = (props) => {
  const [user] = useAuthState(autenticacaoFirebase);

  const selectedFileRef = useRef<HTMLInputElement>(null);

  const { selecionadoFile, setSelecionadoFile, onSelecionarImagem } =
    useSelectFile();

  const [uploadingImage, setUploadingImage] = useState(false);

  const setComunidadeStateValue = useSetRecoilState(comunidadeState);

  const onUpdateImage = async () => {
    if (!selecionadoFile) return;
    setUploadingImage(true);
    try {
      const imageRef = ref(
        storageFirebase,
        `comunidades/${props.comunidadeData.id}/image`
      );
      await uploadString(imageRef, selecionadoFile, "data_url");
      const downloadURL = await getDownloadURL(imageRef);

      await updateDoc(doc(firestore, "comunidades", props.comunidadeData.id), {
        imageURL: downloadURL,
      });
      console.log("here is update image url", downloadURL);
      setComunidadeStateValue((prev) => ({
        ...prev,
        comunidadeAtual: {
          ...prev.comunidadeAtual,
          imageURL: downloadURL as string,
        } as Comunidade,
      }));
    } catch (error) {
      console.log("onupdate image error", error);
    }
    setUploadingImage(false);
  };
  return (
    <Box position={"sticky"} top="14px">
      <Flex
        justify={"space-between"}
        align="center"
        bg="blue.400"
        color="white"
        p={3}
        borderRadius="4px 4px 0px 0px"
      >
        <Text fontSize={"10pt"} fontWeight={700}>
          Sobre a comunidade
        </Text>
        <Icon as={HiOutlineDotsHorizontal} />
      </Flex>
      <Flex
        direction={"column"}
        p={3}
        bg="white"
        borderRadius={"0px 0px 4px 4px"}
      >
        <Stack>
          <Flex width={"100%"} p={2} fontSize="10pt" fontWeight={700}>
            <Flex direction={"column"} flexGrow={1}>
              <Text>
                {props.comunidadeData.numberOfMembers.toLocaleString()}
              </Text>
              <Text>Membros</Text>
            </Flex>
            <Flex direction={"column"} flexGrow={1}>
              <Text>1</Text>
              <Text>Online</Text>
            </Flex>
          </Flex>
          <Divider />
          <Flex
            align="center"
            width={"100%"}
            p={1}
            fontWeight={500}
            fontSize="10pt"
          >
            <Icon as={RiCakeLine} fontSize={18} mr={2} />
            {props.comunidadeData.createdAt && (
              <Text>
                Criado{" "}
                {moment(
                  new Date(props.comunidadeData.createdAt?.seconds * 1000)
                )
                  .locale("pt-br")
                  .format("DD MMM, YYYY")}
              </Text>
            )}
          </Flex>
          <Link href={`/r/${props.comunidadeData.id}/submit`}>
            <Button width={"100%"} mt={3} height="30px">
              Criar Post
            </Button>
          </Link>
          {user?.uid === props.comunidadeData.creatorId && (
            <>
              <Divider />
              <Stack spacing={1} fontSize="10pt">
                <Text fontWeight={600}>Admin</Text>
                <Flex align={"center"} justify="space-between">
                  <Text
                    color="blue.500"
                    cursor="pointer"
                    _hover={{ textDecoration: "underline" }}
                    onClick={() => selectedFileRef.current?.click()}
                  >
                    Trocar Imagem
                  </Text>
                  {props.comunidadeData.imageURL || selecionadoFile ? (
                    <Image
                      src={selecionadoFile || props.comunidadeData.imageURL}
                      borderRadius={"full"}
                      boxSize="40px"
                      alt="Imagem comunidade"
                    />
                  ) : (
                    <Icon
                      as={FaReddit}
                      fontSize={40}
                      color="brand.100"
                      mr={2}
                    />
                  )}
                </Flex>
                {selecionadoFile &&
                  (uploadingImage ? (
                    <Spinner />
                  ) : (
                    <Text cursor="pointer" onClick={onUpdateImage}>
                      Salvar alterações
                    </Text>
                  ))}
                <input
                  id="file-upload"
                  ref={selectedFileRef}
                  accept="image/x-png,image/gif,image/jpeg"
                  type="file"
                  hidden
                  onChange={onSelecionarImagem}
                />
              </Stack>
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};
export default SobreComunidade;
