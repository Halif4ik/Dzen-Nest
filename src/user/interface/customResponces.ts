import {Auth} from "@prisma/client";

export type IUser ={
    "id": number;
}

export interface IRespAuth {
    "auth": Auth
}

export type TJwtBody = {
    id: number,
    email: string,
    userName: string,
    iat?: number,
    exp?: number
}

