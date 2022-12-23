import { Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { isTemplateExpression } from "typescript";
import { TabItem } from "./FormCriarPost";
type TabItemProps = {
  item: TabItem;
  selecionado: boolean;
  setTabSelecionado: (value: string) => void;
};

const MenuTabsItems: React.FC<TabItemProps> = (props) => {
  return (
    <Flex
      justify={"center"}
      align="center"
      flexGrow={1}
      cursor="pointer"
      _hover={{ bg: "gray.50" }}
      fontWeight={700}
      p="14px 0px"
      color={props.selecionado ? "blue.500" : "gray.500"}
      borderWidth={props.selecionado ? "0px 1px 2px 0px" : "0px 1px 1px 0px"}
      borderBottomColor={props.selecionado ? "blue.500" : "gray.200"}
      onClick={() => props.setTabSelecionado(props.item.titulo)}
    >
      {" "}
      <Flex align={"center"} height="20px" mr={2}>
        <Icon as={props.item.icon} />
      </Flex>
      <Text fontSize={"10pt"}>{props.item.titulo}</Text>
    </Flex>
  );
};
export default MenuTabsItems;
