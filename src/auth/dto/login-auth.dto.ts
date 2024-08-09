import {IsEmail, IsString, Length} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {Transform} from "class-transformer";

export class LoginUserDto {
    @ApiProperty({example: 'temp@gmail.com', description: 'E-mail of user'})
    @IsEmail({},{message: 'E-mail, should be string'})
    @Length(8, 255,{ message:' E-mail Min length 8 max length 255'})
    readonly email:string;

    @Transform(({value}) => {
        if( value.trim() === '') return null;
        return value;
    })
    @ApiProperty({example: '123456', description: 'Password of account'})
    @IsString({message: 'Password should be string'})
    @Length(6, 20,{ message:'Password Min lenth 6 max length 20'})
    readonly pass:string;
}
