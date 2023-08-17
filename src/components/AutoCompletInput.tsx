import React from "react";
import { Text } from "native-base";
import AutocompleteInput from "react-native-autocomplete-input";
import { StyleSheet } from "react-native";

export default function AutoCompleteInputComp() {
  return <AutocompleteInput data={["a", "b", "c"]} style={styles.input} />;
}

const styles = StyleSheet.create({
  input: {
    width: 200,
    height: 40,
  },
});
