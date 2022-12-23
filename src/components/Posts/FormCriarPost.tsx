import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Flex,
  Text,
  Icon,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { BiPoll } from "react-icons/bi";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { Post } from "../../atoms/postAtom";
import { firestore, storageFirebase } from "../../firebase/clientApp";
import useSelectFile from "../../hooks/useSelectFile";
import MenuTabsItems from "./MenuTabsItems";
import ImagemUpload from "./PostForm/ImagemUpload";
import TextInputs from "./PostForm/TextInputs";

type FormCriarPostProps = {
  user: User;
};

const formTabs: TabItem[] = [
  {
    titulo: "Post",
    icon: IoDocumentText,
  },
  {
    titulo: "Imagens & Video",
    icon: IoImageOutline,
  },
  {
    titulo: "Link",
    icon: BsLink45Deg,
  },
  {
    titulo: "Poll",
    icon: BiPoll,
  },
  {
    titulo: "Gravar",
    icon: BsMic,
  },
];
export type TabItem = {
  titulo: string;
  icon: typeof Icon.arguments;
};

const FormCriarPost: React.FC<FormCriarPostProps> = (props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [tabSelecionada, setTabSelecionada] = useState(formTabs[0].titulo);
  const [textInputs, setTextInputs] = useState({
    titulo: "",
    body: "",
  });
  const { selecionadoFile, setSelecionadoFile, onSelecionarImagem } =
    useSelectFile();

  const handleCriarPost = async () => {
    // criar novo post object
    const { comunidadeId } = router.query;
    const novoPost: Post = {
      comunidadeId: comunidadeId as string,
      criadorId: props.user?.uid,
      criadorDisplayName: props.user.email!.split("@")[0],
      titulo: textInputs.titulo,
      body: textInputs.body,
      numberOfComments: 0,
      voteStatus: 0,
      createdAt: serverTimestamp() as Timestamp,
    };
    setLoading(true);

    try {
      // guardar na firebase
      const postDocRef = await addDoc(collection(firestore, "posts"), novoPost);

      // checar por selecionadoFile
      if (selecionadoFile) {
        // guardar no storage e retornar getDownloadURL ( imageURL)
        const imageRef = ref(storageFirebase, `posts${postDocRef.id}/image`);
        await uploadString(imageRef, selecionadoFile, "data_url");

        const downloadURL = await getDownloadURL(imageRef);

        // update post doc com imagemURL
        await updateDoc(postDocRef, { imageURL: downloadURL });
      }

      //redirecionar utilizador para a pagina da comunidade
      router.back();
    } catch (error) {
      console.log("handlecriarpost error", error);
      setError(true);
    }
    setLoading(false);
  };

  const onTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { name, value },
    } = event;

    setTextInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Flex direction={"column"} background="white" borderRadius={4} mt={2}>
      <Flex width={"100%"}>
        {formTabs.map((item) => (
          <MenuTabsItems
            key={item.titulo}
            item={item}
            selecionado={item.titulo === tabSelecionada}
            setTabSelecionado={setTabSelecionada}
          />
        ))}
      </Flex>
      <Flex p={4}>
        {tabSelecionada === "Post" && (
          <TextInputs
            textInputs={textInputs}
            handleCriarPost={handleCriarPost}
            onChange={onTextChange}
            loading={loading}
          />
        )}
        {tabSelecionada === "Imagens & Video" && (
          <ImagemUpload
            selecionadoFile={selecionadoFile}
            onSelecionarImagem={onSelecionarImagem}
            setTabSelecionado={setTabSelecionada}
            setSelecionadoFile={setSelecionadoFile}
          />
        )}
      </Flex>
      {error && (
        <Alert status="error">
          <AlertIcon />
          <Text mr={2}> Error na criação do Post</Text>
        </Alert>
      )}
    </Flex>
  );
};
export default FormCriarPost;
