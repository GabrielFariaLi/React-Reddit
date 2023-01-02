import { SearchIcon } from "@chakra-ui/icons";
import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Image,
  Icon,
} from "@chakra-ui/react";

import { User } from "firebase/auth";
import { query, collection, orderBy, limit, getDocs } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaReddit } from "react-icons/fa";
import { Comunidade } from "../../atoms/comunidadesAtom";
import { firestore } from "../../firebase/clientApp";

type InputBuscaProps = {
  user?: User | null;
};

const InputBusca: React.FC<InputBuscaProps> = (props) => {
  const [search, setSearch] = useState("");
  const [comunidades, setComunidades] = useState<Comunidade[]>([]);
  const [clickFlag, setClickFlag] = useState(false);
  const [loding, setLoading] = useState(false);
  const router = useRouter();

  const onTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event;

    setSearch(value);
    console.log("search value", value);
  };

  const goToComunidade = (comunidadeId: String) => {
    console.log(` teste /r/${comunidadeId}`);
    router.push(`/r/${comunidadeId}`);
  };

  const getComunidades = async () => {
    setLoading(true);
    try {
      const comunidadeQuery = query(
        collection(firestore, "comunidades"),
        orderBy("numberOfMembers", "desc")
      );
      const comunidadeDocs = await getDocs(comunidadeQuery);
      const comunidades = comunidadeDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComunidades(comunidades as Comunidade[]);
      console.log("comunidades search input", comunidades);
    } catch (error) {
      console.log("getcomunidaderecomendacoes error", error);
    }
    setLoading(false);
  };

  // notar por mudanças no serach input e buscar comunidades
  useEffect(() => {}, []);

  // pegar todas as comunidades
  useEffect(() => {
    getComunidades();
  }, []);

  return (
    <Flex
      flexGrow={1}
      maxWidth={props.user ? "auto" : "600px"}
      mr={2}
      align="center"
    >
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<SearchIcon color="gray.400" mb={1} />}
        />
        <Input
          onFocus={() => setClickFlag(true)}
          onBlur={() => setClickFlag(false)}
          onChange={onTextChange}
          placeholder="Busque no Reddit"
          fontSize="10pt"
          _placeholder={{ color: "gray.500" }}
          _hover={{ bg: "hite", border: "1px solid", borderColor: "blue.500" }}
          _focus={{
            outline: "none",
            border: "1px solid",
            borderColor: "blue.500",
          }}
        />
        {clickFlag && (
          <Flex
            onBlur={() => setClickFlag(false)}
            zIndex={4}
            minHeight={"40px"}
            width={"100%"}
            borderRadius={"0px 0px 20px 20px"}
            top={"100%"}
            bg={"white"}
            height="fit-content"
            position={"absolute"}
            direction="column"
          >
            {comunidades.map((item, index) => (
              <div key={item.id}>
                {item.id.toLowerCase().includes(search.toLowerCase()) &&
                  search != "" && (
                    <Flex
                      onMouseDown={() => goToComunidade(item.id)}
                      _hover={{ bg: "gray.100", cursor: "pointer" }}
                      p={5}
                      direction={"row"}
                    >
                      {item.imageURL ? (
                        <Image
                          borderRadius="full"
                          boxSize="28px"
                          src={item.imageURL}
                          mr={2}
                        />
                      ) : (
                        <Icon
                          as={FaReddit}
                          fontSize={30}
                          color="brand.100"
                          mr={2}
                        />
                      )}
                      <span
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {`r/${item.id}`}
                      </span>
                    </Flex>
                  )}
              </div>
            ))}
          </Flex>
        )}
      </InputGroup>
    </Flex>
  );
};
export default InputBusca;
