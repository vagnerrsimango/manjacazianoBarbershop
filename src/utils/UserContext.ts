import { createContext } from "react";

export interface Iuser {
  name: string;
  phone: string;
  type: number;
  balace: number;
  sub: string;
}

export interface IUserContext {
  user: Iuser | null;
  setUser: React.Dispatch<React.SetStateAction<Iuser | null>>;
  loginWithPin: (input: string) => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserContext = createContext<IUserContext>({} as IUserContext);
