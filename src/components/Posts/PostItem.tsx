import React, { useEffect, useState } from "react";
import {
  Alert,
  AlertIcon,
  Flex,
  Icon,
  Image,
  Skeleton,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";

import { Post } from "../../atoms/postAtom";
import { AiOutlineDelete } from "react-icons/ai";
import { BsChat, BsDot } from "react-icons/bs";
import { FaReddit } from "react-icons/fa";
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
} from "react-icons/io5";
import moment from "moment";
import "moment/locale/pt-br";
import { useRouter } from "next/router";
import Link from "next/link";

type PostItemProps = {
  post: Post;
  userIsCreator: boolean;
  userVoteValue?: number;
  onVote: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    vote: number,
    comunidadeId: string
  ) => {};
  onDeletePost: (post: Post) => Promise<boolean>;
  onSelectPost?: (post: Post) => void;
  homePage?: boolean;
};

const PostItem: React.FC<PostItemProps> = (props) => {
  const [loadingImage, setLoadingImage] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [error, setError] = useState(false);

  const router = useRouter();
  const singlePostPage = !props.onSelectPost;

  const handleDelete = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setLoadingDelete(true);
    try {
      const success = await props.onDeletePost(props.post);
      if (!success) {
        throw new Error("Falha em deletar o post");
      }

      console.log("post deletado com sucesso!");
      if (singlePostPage) {
        router.push(`/r/${props.post.comunidadeId}`);
      }
    } catch (error: any) {
      console.log("handle delete error", error);
      setError(error.message);
    }
    setLoadingDelete(false);
  };
  return (
    <Flex
      border="1px solid"
      borderColor={singlePostPage ? "white" : "gray.300"}
      borderRadius={singlePostPage ? "4px 4px 0px 0px" : "4px"}
      _hover={{ borderColor: singlePostPage ? "none" : "gray.500" }}
      cursor={singlePostPage ? "unset" : "pointer"}
      bg="white"
      onClick={() => props.onSelectPost && props.onSelectPost(props.post)}
    >
      <Flex
        direction={"column"}
        align="center"
        bg={singlePostPage ? "none" : "gray.100"}
        p={2}
        width="40px"
        borderRadius={singlePostPage ? "0px" : "3px 0px 0px 3px"}
      >
        <Icon
          as={
            props.userVoteValue === 1
              ? IoArrowUpCircleSharp
              : IoArrowUpCircleOutline
          }
          color={props.userVoteValue === 1 ? "brand.100" : "gray.400"}
          fontSize={22}
          onClick={(event) =>
            props.onVote(event, props.post, 1, props.post.comunidadeId)
          }
          cursor="pointer"
        />

        <Text fontSize={"9pt"}>{props.post.voteStatus}</Text>
        <Icon
          as={
            props.userVoteValue === -1
              ? IoArrowDownCircleSharp
              : IoArrowDownCircleOutline
          }
          color={props.userVoteValue === -1 ? "#4379ff" : "gray.400"}
          fontSize={22}
          onClick={(event) =>
            props.onVote(event, props.post, -1, props.post.comunidadeId)
          }
          cursor="pointer"
        />
      </Flex>
      <Flex direction={"column"} width="100%">
        {error && (
          <Alert status="error">
            <AlertIcon />
            <Text mr={2}> {error}</Text>
          </Alert>
        )}
        <Stack spacing={1} p="10px">
          <Stack direction="row" spacing={0.6} align="center" fontSize="9pt">
            {/* HOMEPAGE CHECK */}
            {props.homePage && (
              <>
                {props.post.comunidadeImagemURL ? (
                  <Image
                    src={props.post.comunidadeImagemURL}
                    borderRadius="full"
                    boxSize={"18px"}
                    mr={2}
                  />
                ) : (
                  <Icon as={FaReddit} fontSize="18pt" mr={1} color="blue.500" />
                )}
                <Link href={`r/${props.post.comunidadeId}`}>
                  <Text
                    onClick={(event) => event.stopPropagation()}
                    fontWeight={700}
                    _hover={{ textDecoration: "underline" }}
                  >{`r/${props.post.comunidadeId}`}</Text>
                </Link>
                <Icon as={BsDot} color="gray.500" fontSize={8} />
              </>
            )}
            <Text>
              Postado por u/{props.post.criadorDisplayName}{" "}
              {moment(new Date(props.post.createdAt?.seconds * 1000))
                .locale("pt-br")
                .fromNow()}
            </Text>
          </Stack>
          <Text fontSize={"12pt"} fontWeight={600}>
            {props.post.titulo}
          </Text>
          <Text fontSize={"10pt"}>{props.post.body}</Text>
          {props.post.imageURL && (
            <Flex justify={"center"} align="center">
              {loadingImage && (
                <Skeleton height="200px" width={"100%"} borderRadius={4} />
              )}
              <Image
                src={props.post.imageURL}
                maxHeight="460px"
                alt="Post image"
                display={loadingImage ? "none" : "unset"}
                onLoad={() => setLoadingImage(false)}
              />
            </Flex>
          )}
        </Stack>
        <Flex ml={1} mb={0.5} color="gray.500">
          <Flex
            align={"center"}
            padding="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={BsChat} mr={2} />
            <Text fontSize={"9pt"}>{props.post.numberOfComments}</Text>
          </Flex>
          <Flex
            align={"center"}
            padding="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={IoArrowRedoOutline} mr={2} />
            <Text fontSize={"9pt"}>Compartilhar</Text>
          </Flex>
          <Flex
            align={"center"}
            padding="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={IoBookmarkOutline} mr={2} />
            <Text fontSize={"9pt"}>Salvar</Text>
          </Flex>
          {props.userIsCreator && (
            <Flex
              align={"center"}
              padding="8px 10px"
              borderRadius={4}
              _hover={{ bg: "red.50" }}
              cursor="pointer"
              onClick={handleDelete}
            >
              {loadingDelete ? (
                <Spinner size={"sm"} />
              ) : (
                <>
                  <Icon as={AiOutlineDelete} mr={2} />
                  <Text fontSize={"9pt"}>Deletar</Text>
                </>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default PostItem;
