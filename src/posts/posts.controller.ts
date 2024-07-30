import {
   Controller,
   Get,
   Post,
   HttpCode,
   Query,
   UsePipes,
   ValidationPipe,
   UseInterceptors,
   Body,
   UploadedFile, ParseFilePipe, MaxFileSizeValidator, UseGuards, FileTypeValidator
} from '@nestjs/common';
import {PostsService} from './posts.service';
import {ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiResponse} from "@nestjs/swagger";
import {UserExistResponseClass, UserResponseClass} from "../user/dto/responce-user.dto";
import * as process from "process";
import {FileInterceptor} from "@nestjs/platform-express";
import {PaginationsDto} from "./dto/parination-post.dto";
import {CreatePostDto} from "./dto/create-post.dto";
import {Express} from 'express';
import {Customer, Posts} from "@prisma/client";
import {UserDec} from "../auth/decor-pass-user";
import {AuthGuard} from "@nestjs/passport";
import {JwtAuthRefreshGuard} from "../auth/jwt-Refresh.guard";

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
   @ApiOperation({summary: 'Got posts from database'})
   @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
   async findAll(@Query() paginationsDto: PaginationsDto): Promise<{ posts: Posts[], amountPage: number }> {
      return this.postsService.findAll(paginationsDto);
   }

   //2.Registered Users can create new Post
   //Endpoint: POST /api/posts
   // Permissions: Logined users with JWT  token
   @Post('/create')
   @HttpCode(200)
   @ApiOkResponse({
      status: 200,
      description: "Posts created successfully",
      type: UserResponseClass
   })
   @ApiBadRequestResponse({
      status: 400,
      description: "Posts creating went wrong",
      type: UserExistResponseClass
   })
   @ApiOperation({summary: 'Created Post in database'})
   @UseGuards(AuthGuard('jwt-auth'))
   @UseInterceptors(FileInterceptor('image'))
   @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
   async create(@Body() createPostDto: CreatePostDto, @UserDec() userFromGuard: Customer, @UploadedFile(
       new ParseFilePipe({
          validators: [
             new FileTypeValidator({fileType: /^(image\/jpg|image\/gif|image\/png|image\/jpeg|text\/plain)$/}),
          ],
       }),
   ) file: Express.Multer.File): Promise<any> {
      return this.postsService.create(createPostDto, userFromGuard, [file]);
   }

}
