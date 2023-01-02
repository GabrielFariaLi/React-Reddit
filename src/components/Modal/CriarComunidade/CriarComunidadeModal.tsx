import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  ModalFooter,
  Box,
  Input,
  Stack,
  Checkbox,
  Flex,
  Icon,
} from "@chakra-ui/react";
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import Router, { useRouter } from "next/router";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsFillEyeFill, BsFillPersonFill } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi";
import { useSetRecoilState } from "recoil";
import { comunidadeState } from "../../../atoms/comunidadesAtom";
import { autenticacaoFirebase, firestore } from "../../../firebase/clientApp";
import useDiretorio from "../../../hooks/useDiretorio";

type CriarComunidadeModalProps = {
  open: boolean;
  handleClose: () => void;
};

const CriarComunidadeModal: React.FC<CriarComunidadeModalProps> = (props) => {
  const router = useRouter();
  const setSnippetState = useSetRecoilState(comunidadeState);
  const [user] = useAuthState(autenticacaoFirebase);
  const [nomeComunidade, setNomeComunidade] = useState("");
  const [caracteresRestantes, setCaracteresRestantes] = useState(21);
  const [tipoComunidade, setTipoComunidade] = useState("publico");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { toggleMenuOpen } = useDiretorio();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //nome de comunidade maior que 21 caracteres portanto não salvaremos
    if (event.target.value.length > 21) return;

    setNomeComunidade(event.target.value);
    //calcular quantos caracteres restantes faltam
    setCaracteresRestantes(21 - event.target.value.length);
  };

  const onTipoComunidadeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTipoComunidade(event.target.name);
  };

  const handleCriarComunidade = async () => {
    if (error) setError("");
    //validar nome da comunidade
    var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (format.test(nomeComunidade) || nomeComunidade.length < 3) {
      setError(
        "Comunidades têm de ter entre 3-21 caracteres e só podem conter letras, números ou underscores"
      );
      return;
    }

    setLoading(true);

    try {
      //criar comunidade

      const comunidadeDocRef = doc(firestore, "comunidades", nomeComunidade);

      await runTransaction(firestore, async (transaction) => {
        // checar se comunidade ja existe
        const comunidadeDoc = await transaction.get(comunidadeDocRef);
        if (comunidadeDoc.exists()) {
          throw new Error(
            `Desculpe, r/${nomeComunidade} já existe. Tente outra vez.`
          );
        }

        transaction.set(comunidadeDocRef, {
          creatorId: user?.uid,
          createdAt: serverTimestamp(),
          numberOfMembers: 1,
          imageURL: "",
          privacyType: tipoComunidade,
        });

        // criar snippet da comunidade em todos os utilizadores
        transaction.set(
          doc(
            firestore,
            `users/${user?.uid}/snippetComunidade`,
            nomeComunidade
          ),
          {
            comunidadeId: nomeComunidade,
            imageURL: null,
            isModerator: true,
          }
        );
      });
      props.handleClose();
      router.push(`/r/${nomeComunidade}`);
      toggleMenuOpen();
    } catch (error: any) {
      console.log("handleCriarComunidade error", error);
      setError(error.message);
    }
    /*     setSnippetState((prev) => ({
      ...prev,
      mySnippets: [],
    })); */
    props.handleClose();
    router.push(`/r/${nomeComunidade}`);
    setLoading(false);
  };
  return (
    <>
      <Modal size="lg" isOpen={props.open} onClose={props.handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            flexDirection="column"
            fontSize={15}
            padding={3}
          >
            Criar uma nova comunidade
          </ModalHeader>
          <Box pl={3} pr={3}>
            <ModalCloseButton />
            <ModalBody
              display="flex"
              flexDirection={"column"}
              padding="10px 0px"
            >
              <Text fontWeight={600} fontSize={15}>
                Nome
              </Text>
              <Text color={"gray.500"} fontSize={11}>
                Nomes de comunidades com letras capitalizadas não poderão ser
                alteradas.
              </Text>
              <Text
                color={"gray.400"}
                position={"relative"}
                top="28px"
                left="10px"
                width="20px"
              >
                r/
              </Text>
              <Input
                position={"relative"}
                value={nomeComunidade}
                size="sm"
                pl="22px"
                onChange={handleChange}
              />
              <Text
                fontSize={"9pt"}
                color={caracteresRestantes === 0 ? "red" : "gray.500"}
              >
                {caracteresRestantes} Caracteres restantes
              </Text>
              <Text fontSize={"9pt"} color="red" pt={1}>
                {error}
              </Text>
              <Box mt={4} mb={4}>
                <Text fontWeight={600} fontSize={15}>
                  Tipo de comunidade
                </Text>
                <Stack spacing={2}>
                  <Checkbox
                    name="publico"
                    isChecked={tipoComunidade === "publico"}
                    onChange={onTipoComunidadeChange}
                  >
                    <Flex align={"center"}>
                      <Icon as={BsFillPersonFill} color="gray.500" mr={2} />
                      <Text mr={1} fontSize={"10pt"}>
                        Público
                      </Text>
                      <Text mr={1} fontSize={"8pt"} color="gray.500" pt={1}>
                        Qualquer um pode visualizar, postar e comentar nessa
                        comunidade
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    name="restrito"
                    isChecked={tipoComunidade === "restrito"}
                    onChange={onTipoComunidadeChange}
                  >
                    <Flex align={"center"}>
                      <Icon as={BsFillEyeFill} color="gray.500" mr={2} />
                      <Text mr={1} fontSize={"10pt"}>
                        Restrito
                      </Text>
                      <Text mr={1} fontSize={"8pt"} color="gray.500" pt={1}>
                        Qualquer um pode visualizar essa comunidade, porém
                        apenas utilizadores aprovados podem postar
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    name="privado"
                    isChecked={tipoComunidade === "privado"}
                    onChange={onTipoComunidadeChange}
                  >
                    <Flex align={"center"}>
                      <Icon as={HiLockClosed} color="gray.500" mr={2} />
                      <Text mr={1} fontSize={"10pt"}>
                        Privado
                      </Text>
                      <Text mr={1} fontSize={"8pt"} color="gray.500" pt={1}>
                        Apenas utilizadores aprovados podem visualizar e postar
                        nessa comunidade
                      </Text>
                    </Flex>
                  </Checkbox>
                </Stack>
              </Box>
            </ModalBody>
          </Box>

          <ModalFooter bg="gray.100" borderRadius={"0px 0px 10px 10px"}>
            <Button
              variant="outline"
              height="30px"
              mr={3}
              onClick={props.handleClose}
            >
              Cancelar
            </Button>
            <Button
              isLoading={loading}
              height="30px"
              onClick={handleCriarComunidade}
            >
              Criar comunidade
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CriarComunidadeModal;
