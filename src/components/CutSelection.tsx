import React from "react";
import { Box, Icon, Button, VStack, Flex } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ServiceSelector, { IServiceSelectorProps } from "./ServiceSelector";
import { FlatList } from "react-native-gesture-handler";
import { useCart } from "../utils/LocalHooks";
import ServiceSkeleton from "./ServiceSkeleton";

interface IcutSession {
  children: React.ReactNode;
  data: Array<IServiceSelectorProps>;
  loading: boolean;
}

const CutSelection = ({
  children,
  loading,
  data = [],
  ...rest
}: IcutSession) => {
  const { services, setServices } = useCart();

  const handleCartItems = (item: IServiceSelectorProps) => {
    // services.push(item);
    // setServices(services);

    services.map((service) => {
      if (service.id === item.id) {
        const updatedItems = services.filter(
          (element) => element.id !== item.id
        );
        console.log(
          "🚀 ~ file: CutSelection.tsx:25 ~ services.map ~ updatedItems:",
          updatedItems.length
        );

        setServices([]);

        return null;
      }
    });

    setServices((prev) => [...prev, item]);
  };
  return (
    <Box mt={10} {...rest}>
      <Flex direction="row" alignItems="center" mt={4}>
        {children}
        {loading ? (
          <ServiceSkeleton />
        ) : (
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <ServiceSelector service={item} handlePressed={handleCartItems} />
            )}
          />
        )}
      </Flex>
    </Box>
  );
};

export default CutSelection;
