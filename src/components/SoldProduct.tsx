import React from "react";
import Tag from "./Tag";
import {
  Box,
  HStack,
  VStack,
  Text,
  Spacer,
  Image,
  useTheme,
  FlatList,
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity } from "react-native";
import {
  ISaleCustomerHistoryServiceResponse,
  ISaleCustomerHistory,
} from "../utils/Responses";

type ISoldComponentPops = {
  item: ISaleCustomerHistory;
};

export default function SoldProduct({ item }: ISoldComponentPops) {
  const { colors } = useTheme();
  return (
    <Box
      borderBottomWidth={1}
      borderColor="primary.300"
      borderRadius={8}
      p={3}
      mb={4}
    >
      <HStack space={[2, 3]} justifyContent="space-between" w={"80%"} mt={2}>
        <Icon name="user-circle" size={48} color={colors.primary[500]} />
        <VStack ml={"10"}>
          <Text color="black" bold fontSize="md">
            Pago - {item.paid} MT
          </Text>
          <Text fontSize="md" color="primary.500" alignSelf="flex-start">
            {new Date(item.finalized_at).toLocaleString()}
          </Text>
        </VStack>
        <Spacer />
        <VStack>
          <Text color={"red.500"} fontSize="md" fontWeight={"bold"}>
            De - {item.total_amount} MT
          </Text>
        </VStack>
      </HStack>

      <FlatList
        data={item.sold_products}
        renderItem={(prod) => <Tag title={prod.item.products.name} />}
        horizontal
      />
      {/* <HStack>
        <Tag title="Cabelo" />
        <Tag title="Cabelo" />
        <Tag title="Cabelo" />
        <Tag title="Cabelo" />
        <Tag title="Cabelo" />
        <Tag title="Cabelo" />
      </HStack> */}
    </Box>
  );
}
