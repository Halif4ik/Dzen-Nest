import {IsNotEmpty, IsNumber, IsOptional, IsString, Length, Min} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreatePostDto {
   @ApiProperty({ example: 'This is very interesting book', description: 'Description book' })
   @Length(3, 550, { message: 'Min lenth 3 max length 550' })
   @IsString({ message: 'description should be string' })
   readonly text: string;

   @ApiProperty({ example: 'examp.png', description: 'Image' })
   @IsOptional()
   readonly image: string;
}