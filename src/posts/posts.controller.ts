import {Controller, Get, HttpCode, Query, UsePipes, ValidationPipe} from '@nestjs/common';
import {PostsService} from './posts.service';
import {ApiBadRequestResponse, ApiOkResponse, ApiOperation} from "@nestjs/swagger";
import {UserExistResponseClass, UserResponseClass} from "../user/dto/responce-user.dto";
import {PaginationsDto} from "./dto/create-post.dto";

@Controller('posts')
export class PostsController {
   constructor(private readonly postsService: PostsService) {
   }

   //1.All Users can watch new account
   //Endpoint: GET /api/v1/posts?page=1&revert=false
   // Permissions: All users
   @Get()
   @HttpCode(200)
   @ApiOkResponse({
     status: 200,
     description: "Posts get successfully",
     type: UserResponseClass
   })
   @ApiBadRequestResponse({
     status: 400,
     description: "Something went wrong",
     type: UserExistResponseClass
   })
   @ApiOperation({summary: 'Created User in database'})

   @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
   async findAll(@Query() paginationsDto: PaginationsDto): Promise<any> {
      return this.postsService.findAll(paginationsDto);
   }

}
