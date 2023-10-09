import React from "react";
import { useState } from "react";
import { Iuser, UserContext } from "./UserContext";
import api from "./network/api";
import { IStandardResponse } from "../utils/interface/Responses";
import { getUserByToken } from "./Helper";
import { X } from "phosphor-react-native";

type Props = {
  children: string | JSX.Element | JSX.Element[];
};
export default function UserProvider({ children }: Props) {
  const [user, setUser] = useState({} as Iuser);
  const [loading, setLoading] = useState(false);

  async function loginWithPin(input) {
    setLoading(true);
    try {
      const response = await api.post("/login", { password: input });

      const myResponse: IStandardResponse = response.data;
      if (!myResponse.success) {
        alert("Falha ao autenticar, verifique o teu PIN e tente novamente.");
      } else {
        const token = myResponse.data;
        const user = await getUserByToken(token);
        console.log(
          "🚀 ~ file: UserProviddder.tsx:25 ~ loginWithPin ~ user:",
          user
        );

        api.defaults.headers.common["Authorization"] = "Bearer " + token;

        setUser(user);
      }
    } catch (error) {
      alert("Falha ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <UserContext.Provider
      value={{ user, setUser, loginWithPin, loading, setLoading }}
    >
      {children}
    </UserContext.Provider>
  );
}
