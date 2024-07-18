import {ApiProperty} from '@nestjs/swagger';
import {IsUrl, IsOptional, IsString, isURL, Length, IsNumber, Min, IsEmail} from 'class-validator';
import {Transform} from "class-transformer";

export class CreateUserDto {
  /* @Transform(({value}) => {
      return value.toString() === 'true';
   })
   @ApiProperty({example: true, description: 'Date mode'})
   readonly dateMode: boolean;
*/

   @ApiProperty({example: 'temp@gmail.com', description: 'E-mail of user'})
   @IsEmail({},{message: 'E-mail, should be string'})
   @Length(8, 255, {message: 'E-mail Min length 8 max length 255'})
   readonly email: string;

   @Transform(({value}) => {
      if( value.trim() === '') return null;
      return value;
   })
   @ApiProperty({example: 'Jon Dou', description: 'Name of user'})
   @IsString({message: 'user name, should be string'})
   @Length(2, 255, {message: 'userName Min length 2 max length 255'})
   readonly userName: string;

   @Transform(({value}) => {
      if( value.trim() === '') return null;
      return value;
   })
   @ApiProperty({example: 'https://www.homePage.com', description: 'homePage'})
   @IsUrl({require_protocol: true}, {message: 'homePage should be URL'})
   @Length(3, 255, {message: 'homePage Min length 3 max length 255'})
   @IsOptional()
   readonly homePage: string;

   @Transform(({value}) => {
      if( value.trim() === '') return null;
      return value;
   })
   @ApiProperty({example: '123456', description: 'Password of account'})
   @IsString({message: 'password, should be string'})
   @Length(6, 255, {message: 'Password has got min length 6  and max length 255'})
   readonly pass: string;

   @Transform(({value}) => isNaN(parseInt(value)) ? 1 : parseInt(value),)
   @IsNumber({}, {message: 'Face be Number'})
   @IsOptional()
   @Min(1)
   face: number;
}
