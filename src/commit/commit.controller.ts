import {
   Controller,
   Post,
   Body,
   HttpCode,
   UseGuards,
   UseInterceptors,
   UsePipes, ValidationPipe, UploadedFile, FileTypeValidator, ParseFilePipe, MaxFileSizeValidator
} from '@nestjs/common';
import {CommitService} from './commit.service';
import {ApiBadRequestResponse, ApiOkResponse, ApiOperation} from "@nestjs/swagger";
import {FileInterceptor} from "@nestjs/platform-express";
import {UserExistResponseClass, UserResponseClass} from "../user/dto/responce-user.dto";
import {AuthGuard} from "@nestjs/passport";
import {Commit, Customer} from "@prisma/client";
import {UserDec} from "../auth/decor-pass-user";
import {CreateCommitDto} from "./dto/create-commit.dto";

@Controller('commit')
export class CommitController {
   constructor(private readonly commitService: CommitService) {
   }

   //1.Registered Users can create new Commit for created Post
   //Endpoint: POST /api/v1/commit/create
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
   async create(@Body() createCommitDto: CreateCommitDto, @UserDec() userFromGuard: Customer, @UploadedFile(
       new ParseFilePipe({
          validators: [
             new MaxFileSizeValidator({maxSize: 1024 * 1024 * 20}), //20mb
             new FileTypeValidator({fileType: /^(image\/jpg|image\/gif|image\/png|image\/jpeg|text\/plain)$/}),
          ],
       }),
   ) file: Express.Multer.File): Promise<Commit> {
      return this.commitService.create(createCommitDto, userFromGuard, [file]);
   }
}
