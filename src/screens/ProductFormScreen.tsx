import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { createProduct, updateProduct } from "../utils/network/productService";
import { Product } from "../@types/api";
import { StackScreenProps } from "@react-navigation/stack";

type Props = StackScreenProps<ReactNavigation.RootParamList, "ProductForm">;

const ProductFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const product = route.params?.product as Product | undefined;

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price.toString());
      setDescription(product.description || "");
    }
  }, [product]);

  const handleSubmit = async () => {
    try {
      const productData = { name, price: parseFloat(price), description };
      if (product) {
        await updateProduct({ ...productData, id: product.id });
      } else {
        await createProduct(productData);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Error",
        `Failed to ${product ? "update" : "create"} product.`
      );
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Nome"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Preço"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Descrição"
        value={description}
        onChangeText={setDescription}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <Button
        title={product ? "Atualizar Produto" : "Criar Produto"}
        onPress={handleSubmit}
      />
    </View>
  );
};

export default ProductFormScreen;
