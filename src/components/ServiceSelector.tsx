import React from "react";
import { TouchableOpacity, Text, View } from "react-native";

// Interface for the old ServiceSelector component (used in CartContext)
export interface IServiceSelectorProps {
  id?: string | number;
  name?: string;
  price?: number;
  category?: "Cabelo" | "Barba" | "Cabelo e Barba";
}

// Interface for the new ServiceSelector component
interface ServiceSelectorProps {
  services: { id: string; name: string; price: number }[];
  selectedServices: string[];
  onToggleService: (serviceId: string) => void;
}

const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  services,
  selectedServices,
  onToggleService,
}) => {
  return (
    <View className="space-y-3">
      {services.map((service) => (
        <TouchableOpacity
          key={service.id}
          className={`p-4 rounded-lg border-2 ${
            selectedServices.includes(service.id)
              ? "border-primary-500 bg-primary-50"
              : "border-gray-200 bg-white"
          }`}
          onPress={() => onToggleService(service.id)}
          activeOpacity={0.7}
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-medium text-gray-900">
              {service.name}
            </Text>
            <View className="flex-row items-center space-x-2">
              <Text className="text-lg font-semibold text-primary-500">
                ${service.price}
              </Text>
              <View
                className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                  selectedServices.includes(service.id)
                    ? "border-primary-500 bg-primary-500"
                    : "border-gray-300"
                }`}
              >
                {selectedServices.includes(service.id) && (
                  <View className="w-2 h-2 rounded-full bg-white" />
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ServiceSelector;
