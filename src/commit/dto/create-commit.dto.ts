import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsOptional, IsString, Length, Min} from "class-validator";
import {Transform} from "class-transformer";

export class CreateCommitDto {
   @ApiProperty({ example: 'This is very interesting book', description: 'Description book' })
   @Length(3, 550, { message: 'Min lenth 3 max length 550' })
   @IsString({ message: 'description should be string' })
   readonly text: string;

   @ApiProperty({ example: 'example.png', description: 'Image' })
   @IsOptional()
   readonly image?: string;

   @ApiProperty({ example: '1', description: 'Id of post which has this comment' })
   @Transform(({value}) => isNaN(parseInt(value)) ? 1 : parseInt(value),)
   @IsNumber({}, {message: 'post_id  should be Number'})
   @Min(1)
   readonly post_id: number;

   @ApiProperty({ example: '1', description: 'Id of parent post/comment which has this comment' })
   @Transform(({value}) => isNaN(parseInt(value)) ? 0 : parseInt(value),)
   @IsNumber({}, {message: 'post_id  should be Number'})
   @IsOptional()
   @Min(1)
   readonly parent_comment_id?: number;

}
