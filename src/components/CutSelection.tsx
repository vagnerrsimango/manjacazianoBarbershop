import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CutSelectionProps {
  selectedCut: string;
  onSelectCut: (cut: string) => void;
  cuts: { id: string; name: string; icon: string }[];
}

const CutSelection: React.FC<CutSelectionProps> = ({
  selectedCut,
  onSelectCut,
  cuts,
}) => {
  return (
    <View className="space-y-4">
      <Text className="text-lg font-semibold text-gray-900 mb-3">
        Selecionar Corte
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row space-x-3 px-4">
          {cuts.map((cut) => (
            <TouchableOpacity
              key={cut.id}
              className={`p-4 rounded-lg border-2 items-center min-w-[100px] ${
                selectedCut === cut.id
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 bg-white"
              }`}
              onPress={() => onSelectCut(cut.id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={cut.icon as any}
                size={32}
                color={selectedCut === cut.id ? "#0052A3" : "#6B7280"}
                className="mb-2"
              />
              <Text
                className={`text-sm font-medium text-center ${
                  selectedCut === cut.id ? "text-primary-500" : "text-gray-700"
                }`}
              >
                {cut.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default CutSelection;
