import { Box, Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import React from "react";
import { FaReddit } from "react-icons/fa";
import { Comunidade } from "../../atoms/comunidadesAtom";
import useComunidadeData from "../../hooks/useComunidadeData";

type HeaderProps = {
  comunidadeData: Comunidade;
};

const Header: React.FC<HeaderProps> = (props) => {
  const { comunidadeStateValue, onJoinOrLeaveComunidade, loading } =
    useComunidadeData();
  const isJoined = !!comunidadeStateValue.mySnippets.find(
    (item) => item.comunidadeId === props.comunidadeData.id
  );
  return (
    <Flex direction="column" width="100%" height={"146px"}>
      <Box height="50%" bg="blue.400"></Box>
      <Flex justify={"center"} bg="white" flexGrow={1}>
        <Flex width={"95%"} maxWidth="860px">
          {comunidadeStateValue.comunidadeAtual?.imageURL ? (
            <Image
              borderRadius="full"
              boxSize="66px"
              alt="Dan Abramov"
              position="relative"
              top={-3}
              color="blue.500"
              border="4px solid white"
              src={comunidadeStateValue.comunidadeAtual.imageURL}
            />
          ) : (
            <Icon
              as={FaReddit}
              fontSize={64}
              position={"relative"}
              top={-3}
              border="4px solid white"
              borderRadius={"50%"}
              color="blue.500"
            />
          )}
          <Flex padding={"10px 16px"}>
            {" "}
            <Flex direction={"column"} mr={6}>
              <Text fontWeight={800} fontSize="16pt">
                {props.comunidadeData.id}
              </Text>
              <Text fontWeight={600} fontSize="10pt" color="gray.400">
                r/{props.comunidadeData.id}
              </Text>
            </Flex>
            <Button
              height={"30px"}
              pr={6}
              pl={6}
              isLoading={loading}
              onClick={() =>
                onJoinOrLeaveComunidade(props.comunidadeData, isJoined)
              }
              variant={isJoined ? "outline" : "solid"}
            >
              {isJoined ? "Juntou-se" : "Juntar"}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default Header;
