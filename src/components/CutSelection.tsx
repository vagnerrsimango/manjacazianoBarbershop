import React from 'react';
import { Box, Icon, Button, VStack, Flex } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ServiceSelector, { IServiceSelectorProps } from './ServiceSelector';
import { FlatList } from 'react-native-gesture-handler';
import { useCart } from '../utils/LocalHooks';

interface IcutSession {
  children: React.ReactNode;
  data: Array<IServiceSelectorProps>;
}

const CutSelection = ({ children, data = [], ...rest }: IcutSession) => {
  const { setServices } = useCart();

  const handleCartItems = (item: IServiceSelectorProps) => {
    console.log('teste' + item.id);
    setServices([item]);
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
