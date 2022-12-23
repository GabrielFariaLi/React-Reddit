import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiCakeLine } from "react-icons/ri";
import { Comunidade } from "../../atoms/comunidadesAtom";

type SobreComunidadeProps = {
  comunidadeData: Comunidade;
};

const SobreComunidade: React.FC<SobreComunidadeProps> = (props) => {
  const router = useRouter();
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
          <Link href={`/r/${router.query.comunidadeId}/submit`}>
            <Button mt={3} height="30px">
              Criar Post
            </Button>
          </Link>
        </Stack>
      </Flex>
    </Box>
  );
};
export default SobreComunidade;
