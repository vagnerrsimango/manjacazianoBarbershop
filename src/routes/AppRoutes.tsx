import { NavigationContainer } from "@react-navigation/native";
import AuthRoutes from "./auth.routes";
import SaleRoutes from "./sales.routes";
import useUser from "../utils/hooks/UserHook";

export default function AppRoutes() {
  const { user } = useUser();
  return (
    <NavigationContainer>
      {!user?.name ? <AuthRoutes /> : <SaleRoutes />}
    </NavigationContainer>
  );
}
