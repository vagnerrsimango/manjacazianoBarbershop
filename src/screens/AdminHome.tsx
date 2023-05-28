import React, { useState } from "react";
import { Box, Flex, VStack } from "native-base";
import MyButton from "../components/MyButton";
import Content1 from "../components/Content1";
import Content2 from "../components/Content2";
import Content3 from "../components/Content3";

export default function AdminScreen() {
  const [activeContent, setActiveContent] = useState("skeletons");

  const renderContent = () => {
    switch (activeContent) {
      case "skeletons":
        return <Content1 />;
      case "textboxes":
        return <Content2 />;
      case "images":
        return <Content3 />;
      default:
        return null;
    }
  };

  return (
    <Box bg="primary.100" flex={1}>
      <Flex direction="row" ml={20}>
        {/* Sidebar */}
        <VStack space={4} alignItems="flex-start" p={4} width={200}>
          <MyButton
            title="Página Inicial"
            bg="primary.400"
            width={180}
            onPress={() => setActiveContent("skeletons")}
          />
          <MyButton
            title="Serviços"
            bg="primary.400"
            width={180}
            onPress={() => setActiveContent("textboxes")}
          />
          <MyButton
            title="Usuários"
            bg="primary.400"
            width={180}
            onPress={() => setActiveContent("images")}
          />
          <MyButton
            title="Agendamentos"
            bg="primary.400"
            width={180}
            onPress={() => setActiveContent("skeletons")}
          />
          <MyButton
            title="Relatórios"
            bg="primary.400"
            width={180}
            onPress={() => setActiveContent("skeletons")}
          />
        </VStack>

        {/* Render Content */}
        {renderContent()}
      </Flex>
    </Box>
  );
}
