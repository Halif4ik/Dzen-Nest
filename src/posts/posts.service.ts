import {Body, Injectable, Logger} from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import {ConfigService} from "@nestjs/config";
import {UserService} from "../user/user.service";
import {Customer, Posts} from "@prisma/client";
import {FileElementResponse, FileService} from "./file.service";
import {PaginationsDto} from "./dto/parination-post.dto";
import {CreatePostDto} from "./dto/create-post.dto";

@Injectable()

export class PostsService {
   private readonly logger: Logger = new Logger(PostsService.name);

   constructor(private userService: UserService, private prisma: PrismaService, private fileService: FileService,
               private readonly configService: ConfigService) {
   }

   async findAll(paginationsDto: PaginationsDto): Promise<{ posts: Posts[], amountPage: number }> {
      const {page, revert, start, limit} = paginationsDto;
      const order = revert ? 'desc' : 'asc';
      const lim: number = limit || this.configService.get<number>("PAGE_PAGINATION") || 1;

      const amountAll: number = await this.prisma.posts.count();

      const posts: Posts[] = await this.prisma.posts.findMany({
         skip: page ? (page - 1) * lim : start,
         take: +lim,
         orderBy: {
            id: order,
         },
         include: {user: true},
      });
      this.logger.log(`Amount all- ${amountAll} posts`);

      return {
         posts,
         amountPage: Math.ceil(amountAll / lim) || 1,
      };
   }

   async create(@Body() createPostDto: CreatePostDto, userFromGuard: Customer, images: Express.Multer.File[]): Promise<Posts> {
      /* const currentUser = await this.userService.getUserById(userFromGuard.id);*/
      console.log('userFromGuard-', userFromGuard.id);
      const fileSaved: FileElementResponse | null = await this.fileService.createFile(images);
      console.log('fileSaved-', fileSaved?.name);
      const newPost = await this.prisma.posts.create({
         data: {
            text: createPostDto.text,
            attachedFile: fileSaved?.name || "",
            userId: userFromGuard.id,
         },
      });

      this.logger.log(`Created new Post- ${newPost.id}`);

      return newPost;
   }

}
