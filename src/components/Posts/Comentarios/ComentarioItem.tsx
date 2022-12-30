import { Flex, Icon, Stack, Spinner, Box, Text } from "@chakra-ui/react";
import { Timestamp } from "firebase/firestore";
import moment from "moment";
import React from "react";
import { FaReddit } from "react-icons/fa";
import {
  IoArrowUpCircleOutline,
  IoArrowDownCircleOutline,
} from "react-icons/io5";

type ComentarioItemProps = {
  comentario: Comentario;
  onDeleteComentario: (comentario: Comentario) => void;
  loadingDelete: boolean;
  userId: string;
};

export type Comentario = {
  id: string;
  criadorId: string;
  criadorDisplayText: string;
  comunidadeId: string;
  postId: string;
  postTitulo: string;
  text: string;
  createdAt: Timestamp;
};
const ComentarioItem: React.FC<ComentarioItemProps> = (props) => {
  return (
    <Flex>
      <Box mr={2}>
        <Icon as={FaReddit} fontSize={30} color="gray.300" />
      </Box>
      <Stack spacing={1}>
        <Stack direction="row" align="center" spacing={2} fontSize="8pt">
          <Text
            fontWeight={700}
            _hover={{ textDecoration: "underline", cursor: "pointer" }}
          >
            {props.comentario.criadorDisplayText}
          </Text>
          {props.comentario.createdAt?.seconds && (
            <Text color="gray.600">
              {moment(new Date(props.comentario.createdAt?.seconds * 1000))
                .locale("pt-br")
                .fromNow()}
            </Text>
          )}
          {props.loadingDelete && <Spinner size="sm" />}
        </Stack>
        <Text fontSize="10pt">{props.comentario.text}</Text>
        <Stack
          direction="row"
          align="center"
          cursor="pointer"
          fontWeight={600}
          color="gray.500"
        >
          <Icon as={IoArrowUpCircleOutline} />
          <Icon as={IoArrowDownCircleOutline} />
          {props.userId === props.comentario.criadorId && (
            <>
              <Text fontSize="9pt" _hover={{ color: "blue.500" }}>
                Edit
              </Text>
              <Text
                fontSize="9pt"
                _hover={{ color: "blue.500" }}
                onClick={() => props.onDeleteComentario(props.comentario)}
              >
                Delete
              </Text>
            </>
          )}
        </Stack>
      </Stack>
    </Flex>
  );
};
export default ComentarioItem;
