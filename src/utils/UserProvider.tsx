import { useState } from "react";
import { Iuser, UserContext } from "./UserContext";
import api from "./network/api";

type Props = {
  children: string | JSX.Element | JSX.Element[];
};
export default function UserProvider({ children }: Props) {
  const [user, setUser] = useState({} as Iuser);

  async function loginWithPin() {
    const response = await api.post("/login", { password: "1629" });
    console.log(response.data);
  }

  return (
    <UserContext.Provider value={{ user, setUser, loginWithPin }}>
      {children}
    </UserContext.Provider>
  );
}
