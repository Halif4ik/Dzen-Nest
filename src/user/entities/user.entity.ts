import {ApiProperty} from '@nestjs/swagger';
import {GeneralResponse} from "../interface/generalResponse.interface";
import {IUser} from "../interface/customResponces";


export class UserClass implements GeneralResponse<IUser> {
   @ApiProperty({example: true})
   success: boolean;

   @ApiProperty({example: "User with this device id already exist in db"})
   errors_message: string | null;

   @ApiProperty({example: {id :'qwerty1'}})
   data: IUser| null;
}

