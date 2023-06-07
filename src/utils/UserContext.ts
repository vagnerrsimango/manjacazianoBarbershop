import { createContext } from "react";


export interface Iuser{
    name: string ;
    phone : string; 
    type: number;
    balace: number;
    sub:string;
}


export interface IUserContext {

    user: Iuser
    setUser:any
    loginWithPin: ()=>void 
}


export const UserContext   =  createContext<IUserContext>({} as IUserContext)

