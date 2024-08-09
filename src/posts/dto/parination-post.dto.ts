import {Transform} from "class-transformer";
import {IsNotEmpty, IsNumber, IsOptional, Min} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

/*required Field companyId */
export class PaginationsDto {
   @Transform(({value}) => isNaN(parseInt(value)) ? 1 : parseInt(value),)
   @IsNumber({}, {message: 'page for GET should be number'})
   @IsOptional()
   @Min(1)
   readonly page?: number;


   @Transform(({value}) => {
      return value.toString() === 'true';
   })
   @ApiProperty({example: true, description: 'revert mode'})
   @IsOptional()
   readonly revert?: boolean;

   @Transform(({value}) => isNaN(parseInt(value)) ? 1 : parseInt(value),)
   @IsNumber({}, {message: 'Limit should be Number more than 0'})
   @IsOptional()
   @Min(1)
   limit?: number;

   @Transform(({value}) => isNaN(parseInt(value)) ? -1 : parseInt(value),)
   @IsNumber({}, {message: 'Start should be number'})
   @IsOptional()
   @Min(0)
   start?: number;
}