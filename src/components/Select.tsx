import { Box, Center, CheckIcon, Select } from "native-base";
import React from "react";

const CustomSelect = () => {
  const [service, setService] = React.useState("");
  return (
    <Center>
      <Box maxW="300" mt={4}>
        <Select
          selectedValue={service}
          minWidth="100%"
          color={"#000"}
          bgColor={"primary.200"}
          borderWidth={0}
          borderRadius={0}
          p={4}
          rounded={4}
          accessibilityLabel="Método de pagamento"
          placeholder="Método de pagamento"
          _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size="5" />,
          }}
          mt={1}
          onValueChange={(itemValue) => setService(itemValue)}
        >
          <Select.Item label="Numerário" value="ux" />
          <Select.Item label="Mpesa" value="web" />
          <Select.Item label="Emola" value="cross" />
          <Select.Item label="POS" value="ui" />
        </Select>
      </Box>
    </Center>
  );
};

export default CustomSelect;
