import React, { useState } from "react";

const useSelectFile = () => {
  const [selecionadoFile, setSelecionadoFile] = useState<string>();

  const onSelecionarImagem = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();

    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelecionadoFile(readerEvent.target.result as string);
      }
    };
  };
  return {
    selecionadoFile,
    setSelecionadoFile,
    onSelecionarImagem,
  };
};
export default useSelectFile;
