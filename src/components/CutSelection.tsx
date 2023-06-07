import React from "react";
import { Box, Icon, Button, VStack, Flex } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ServiceSelector, { IServiceSelectorProps } from "./ServiceSelector";
import { FlatList } from "react-native-gesture-handler";
import { useCart } from "../utils/LocalHooks";

interface IcutSession {
  children: React.ReactNode;
  data: Array<IServiceSelectorProps>;
}

const CutSelection = ({ children, data = [], ...rest }: IcutSession) => {
  const { services, setServices } = useCart();

  const handleCartItems = (item: IServiceSelectorProps) => {
    // services.push(item);
    // setServices(services);

    services.map((service) => {
      if (service.id === item.id) {
        console.log("antes", services.length);
        console.log("removido", service);
        services.splice(services.indexOf(service), 1);

        setServices((prev) => services);
        console.log("depois", services.length);
        return;
      }
    });
    setServices((prev) => [...prev, item]);
  };
  return (
    <Box mt={10} {...rest}>
      <Flex direction="row" alignItems="center" mt={4}>
        {children}

        <FlatList
          data={data}
          renderItem={({ item }) => (
            <ServiceSelector service={item} handlePressed={handleCartItems} />
          )}
        />
      </Flex>
    </Box>
  );
};

export default CutSelection;
