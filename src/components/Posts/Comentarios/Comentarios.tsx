import {
  Flex,
  Icon,
  Stack,
  Spinner,
  Box,
  Text,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
  writeBatch,
} from "firebase/firestore";

import moment from "moment";
import React, { useEffect, useState } from "react";
import { FaReddit } from "react-icons/fa";
import {
  IoArrowUpCircleOutline,
  IoArrowDownCircleOutline,
} from "react-icons/io5";
import { useSetRecoilState } from "recoil";
import { Post, postState } from "../../../atoms/postAtom";
import { firestore } from "../../../firebase/clientApp";
import ComentarioInput from "./ComentarioInput";
import ComentarioItem, { Comentario } from "./ComentarioItem";

type ComentariosProps = {
  user: User;
  selecionadoPost: Post | null;
  comunidadeId: string;
};

const Comentarios: React.FC<ComentariosProps> = (props) => {
  const [comentarioText, setComentarioText] = useState("");
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState("");
  const setPostState = useSetRecoilState(postState);
  const onCreateComentario = async () => {
    setCreateLoading(true);
    try {
      const batch = writeBatch(firestore);

      // criar um document do comunetario
      const comentarioDocRef = doc(collection(firestore, "comentarios"));

      const novoComentario: Comentario = {
        id: comentarioDocRef.id,
        criadorId: props.user.uid,
        criadorDisplayText: props.user.email!.split("@")[0],
        comunidadeId: props.comunidadeId,
        postId: props.selecionadoPost?.id!,
        text: comentarioText,
        postTitulo: props.selecionadoPost?.titulo!,
        createdAt: serverTimestamp() as Timestamp,
      };
      batch.set(comentarioDocRef, novoComentario);

      novoComentario.createdAt = { seconds: Date.now() / 1000 } as Timestamp;

      // update post numberOfDocuments +1
      const postDocRef = doc(firestore, "posts", props.selecionadoPost?.id!);
      batch.update(postDocRef, { numberOfComments: increment(1) });
      await batch.commit();

      //update recoil
      setComentarioText("");
      setComentarios((prev) => [novoComentario, ...prev]);
      setPostState((prev) => ({
        ...prev,
        selecionadoPost: {
          ...prev.selecionadoPost,
          numberOfComments: prev.selecionadoPost?.numberOfComments! + 1,
        } as Post,
      }));
    } catch (error) {
      console.log("oncreatecomment error", error);
    }
    setCreateLoading(false);
  };
  const onDeleteComentario = async (comentario: Comentario) => {
    setLoadingDeleteId(comentario.id);
    try {
      const batch = writeBatch(firestore);
      // deletar um document do comunetario
      const comentarioDocRef = doc(firestore, "comentarios", comentario.id);
      batch.delete(comentarioDocRef);
      // update post numberOfDocuments -1
      const postDocRef = doc(firestore, "posts", props.selecionadoPost?.id!);
      batch.update(postDocRef, {
        numberOfComments: increment(-1),
      });
      await batch.commit();

      //update recoil

      setPostState((prev) => ({
        ...prev,
        selecionadoPost: {
          ...prev.selecionadoPost,
          numberOfComments: prev.selecionadoPost?.numberOfComments! - 1,
        } as Post,
      }));

      setComentarios((prev) =>
        prev.filter((item) => item.id !== comentario.id)
      );
    } catch (error) {
      console.log("condelete comment error", error);
    }
    setLoadingDeleteId("");
  };
  const getPostComentarios = async () => {
    try {
      const comentariosQuery = query(
        collection(firestore, "comentarios"),
        where("postId", "==", props.selecionadoPost?.id),
        orderBy("createdAt", "desc")
      );
      const comentariosDocs = await getDocs(comentariosQuery);
      const comentarios = comentariosDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComentarios(comentarios as Comentario[]);
    } catch (error) {
      console.log("getpostcomentarios error", error);
    }
    setFetchLoading(false);
    // criar um document do comunetario
    // update post numberOfDocuments
    //update recoil
  };

  useEffect(() => {
    if (!props.selecionadoPost) return;
    getPostComentarios();
  }, [props.selecionadoPost]);
  return (
    <Box bg="white" p={2} borderRadius="0px 0px 4px 4px">
      {" "}
      <Flex
        direction="column"
        pl={10}
        pr={4}
        mb={6}
        fontSize="10pt"
        width="100%"
      >
        {!fetchLoading && (
          <ComentarioInput
            comentarioText={comentarioText}
            setComentarioText={setComentarioText}
            user={props.user}
            createLoading={createLoading}
            onCreateComentario={onCreateComentario}
          />
        )}
      </Flex>
      <Stack spacing={6} p={2}>
        {fetchLoading ? (
          <>
            {[0, 1, 2].map((item) => (
              <Box key={item} padding="6" bg="white">
                <SkeletonCircle size="10" />
                <SkeletonText mt="4" noOfLines={2} spacing="4" />
              </Box>
            ))}
          </>
        ) : (
          <>
            {!!comentarios.length ? (
              comentarios.map((comentario) => (
                <ComentarioItem
                  key={comentario.id}
                  comentario={comentario}
                  onDeleteComentario={onDeleteComentario}
                  loadingDelete={loadingDeleteId === comentario.id}
                  userId={props.user?.uid}
                />
              ))
            ) : (
              <Flex
                direction="column"
                justify="center"
                align="center"
                borderTop="1px solid"
                borderColor="gray.100"
                p={20}
              >
                <Text fontWeight={700} opacity={0.3}>
                  Sem comentarios ainda
                </Text>
              </Flex>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
};
export default Comentarios;
