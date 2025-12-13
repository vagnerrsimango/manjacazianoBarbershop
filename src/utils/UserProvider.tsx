import React from "react";
import { useState } from "react";
import { Iuser, UserContext } from "./UserContext";
import api from "./network/api";
import { IStandardResponse } from "./Responses";
import { getUserByToken } from "./Helper";

type Props = {
  children: React.ReactNode;
};

export default function UserProvider({ children }: Props) {
  const [user, setUser] = useState<Iuser | null>(null);
  const [loading, setLoading] = useState(false);

  async function loginWithPin(input: string) {
    setLoading(true);
    try {
   
      const response = await api.post("/login", { password: input });

      const myResponse: IStandardResponse = response.data;
      if (!myResponse.success) {
        alert("Falha ao autenticar, verifique o teu PIN e tente novamente.");
      } else {
        const token = myResponse.data;
        const user = await getUserByToken(token);

        api.defaults.headers.common["Authorization"] = "Bearer " + token;

        setUser(user);
      }
    } catch (error) {
      alert("Falha ao autenticar, verifique a conexão e tente novamente.");
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
