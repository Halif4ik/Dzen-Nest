import {ApiProperty} from "@nestjs/swagger";
import {GeneralResponse} from "../interface/generalResponse.interface";
import {Auth} from "@prisma/client";

export class UserResponseClass implements GeneralResponse<{ "id": number }> {
   @ApiProperty({example: true})
   success: boolean;

   @ApiProperty({example: null, type: String})
   errors_message: string | null;

   @ApiProperty({example: {id: "1"}})
   data: { "id": number } | null;
}

export class UserExistResponseClass implements GeneralResponse<{ "id": number }> {
   @ApiProperty({example: false})
   success: boolean;

   @ApiProperty({example: "User with this E-mail already exist in db", type: String})
   errors_message: string | null;

   @ApiProperty({example: null})
   data: { "id": number } | null;
}

export class IncorrectUserCredentials implements GeneralResponse<string | null> {
   @ApiProperty({example: false})
   success: boolean;

   @ApiProperty({example: "Incorrect credentials", type: String})
   errors_message: string;

   @ApiProperty({example: null})
   data: string | null;
}

export class CorrectUserCredentials implements GeneralResponse<Auth> {
   @ApiProperty({example: true})
   success: boolean;

   @ApiProperty({example: null, type: String})
   errors_message: null;

   @ApiProperty({
      example: {
         "id": 1,
         "action_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBpbmFwcGxlQG1haWwudWEiLCJpZCI6MywidXNlck5hbWUiOiJ",
         "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBpbmFwcGxlQG1haWwudWEiLCJpZCI6MywidXNlck5hbWUiOi",
         "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBpbmFwcGxlQG1haWwudWEiLCJpZCI6MywidXNlck5hbWUiOi",
         "createdAt": "2024-07-24T10:40:17.049Z",
         "upadateAt": null,
         "deleteAt": null,
         "userId": 3
      }
   })
   data: Auth;
}
