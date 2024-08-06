import {HttpException, HttpStatus, Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import {ConfigService} from "@nestjs/config";
import {UserService} from "../user/user.service";
import {Customer, Posts} from "@prisma/client";
import {FileElementResponse, FileService} from "./file.service";
import {PaginationsDto} from "./dto/parination-post.dto";
import {CreatePostDto} from "./dto/create-post.dto";
import fs from "fs";
import * as sharp from 'sharp';
import * as path from 'path';


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
         include: {
            user: {
               select: {
                  id: true,
                  userName: true,
                  email: true,
                  face: true,
               }
            },
            commits: {
               select: {
                  id: true,
                  attachedFile: true,
                  userId: true,
                  text: true,
                  postId: true,
                  parentCommId: true,
                  createdAt:true,
                  checkedCom:true,
                  user: {
                     select: {
                        id: true,
                        userName: true,
                        email: true,
                        face: true,
                     }
                  },
                  children:{
                     select:{
                        id: true,
                        attachedFile: true,
                        userId: true,
                        text: true,
                        parentCommId: true,
                        createdAt:true,
                        checkedCom:true,
                        user: {
                           select: {
                              id: true,
                              userName: true,
                              email: true,
                              face: true,
                           }
                        }
                     },

                  }
               }
            },
         },
      });
      this.logger.log(`Geted amount all- ${amountAll} posts`);

      return {
         posts,
         amountPage: Math.ceil(amountAll / lim) || 1,
      };
   }

   async create(createPostDto: CreatePostDto, userFromGuard: Customer, imageOrText: Express.Multer.File[]): Promise<Posts> {
      const sevedFileData: FileElementResponse | null = await this.resizeAndWriteToDisk(imageOrText[0])

      const newPost: Posts = await this.prisma.posts.create({
         data: {
            text: createPostDto.text,
            attachedFile: sevedFileData?.name || "",
            userId: userFromGuard.id,
         },
      });
      this.logger.log(`Created new Post- ${newPost.id}`);

      return newPost;
   }

   async resizeAndWriteToDisk(imageOrTextFile,): Promise<FileElementResponse | null> {
      const mimeTypeImg: string[] = ["image/jpg", "image/gif", "image/png", "image/jpeg"]
      const formatsImg: string[] = ["jpg", "gif", "png"]
      type FormatEnum = 'jpg' | 'png' | 'gif'

      /*check conditions for TXT files*/
      if (imageOrTextFile.mimetype === "text/plain" &&
          imageOrTextFile.size > +(this.configService.get<number>("LIMIT_SIZE_LOADS_FILE") || 102400))
         throw new UnauthorizedException({message: 'Too mach size uploaded .txt file'});

      /*check resize IMG files*/
      let imgName: FileElementResponse = {
         url: '',
         name: `${Date.now()}-${imageOrTextFile.originalname}`,
      };
      const extentionImg = imageOrTextFile.mimetype && formatsImg.includes(imageOrTextFile.mimetype.slice(-3)) ? imageOrTextFile.mimetype.slice(-3) as FormatEnum : "jpeg";
      try {
         if (mimeTypeImg.includes(imageOrTextFile.mimetype)) {
            await sharp(imageOrTextFile.buffer)
                .resize({width: 320, height: 240})
                .toFormat(extentionImg)
                .toFile(path.join(path.join(__dirname, '../../public/upload'), imgName.name));
            return imgName;
            /*else write TXT File*/
         } else {
            return this.fileService.createFile(imageOrTextFile);
         }
      } catch (err) {
         throw new HttpException({
                success: false,
                errors_message: err,
                data: null,
             },
             HttpStatus.NOT_MODIFIED)
      }
   }

}
