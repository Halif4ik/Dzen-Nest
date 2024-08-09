import {
   BadRequestException,
   HttpException,
   HttpStatus,
   Injectable,
   Logger,
   UnauthorizedException
} from '@nestjs/common';
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
/*import {sanitize} from 'dompurify';*/
/*import DOMPurify from "isomorphic-dompurify";*/
import * as DOMPurify from 'isomorphic-dompurify';

import {Parser} from 'htmlparser2';


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
                  createdAt: true,
                  checkedCom: true,
                  user: {
                     select: {
                        id: true,
                        userName: true,
                        email: true,
                        face: true,
                     }
                  },
                  children: {
                     select: {
                        id: true,
                        attachedFile: true,
                        userId: true,
                        text: true,
                        parentCommId: true,
                        createdAt: true,
                        checkedCom: true,
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
      // Check for unclosed or mismatched HTML tags
      if (!this.validateHtmlTags(createPostDto.text))
         throw new BadRequestException('Invalid HTML: Unclosed or mismatched tags detected.');

      const sevedFileData: FileElementResponse | null = await this.resizeAndWriteToDisk(imageOrText[0])

      let sanitizedText;
      try {
         sanitizedText = DOMPurify.sanitize(createPostDto.text, {
            ALLOWED_TAGS: ['a', 'code', 'i', 'strong'],
            ALLOWED_ATTR: ['href', 'title'],
         });
      } catch (e) {
         throw new BadRequestException('Invalid DOMPurify parse in server.');
      }


      const newPost: Posts = await this.prisma.posts.create({
         data: {
            text: sanitizedText,
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

   private validateHtmlTags(input: string): boolean {
      let lastOpenedTag: string | undefined;
      let isValid = true;
      const openTags: string[] = [];
      const improperSelfClosingTagPattern = /<\s*(img|br|hr|input|meta|link)(?!.*\/\s*>)([^>]*)>/i;

      // Define a pattern to check if any of the specified tags are present in the input
      const tagPresencePattern = /(img|br|hr|input|meta|link)/i;

      // Check if the input contains any of the specified tags
      if (tagPresencePattern.test(input)) {
         // If one of the tags is present, check for improperly closed self-closing tags
         if (!improperSelfClosingTagPattern.test(input)) return false;

      }
      // Check for improperly closed self-closing tags
      if (!improperSelfClosingTagPattern.test(input)) return false;
      const parser = new Parser({
         onopentag(name) {
            openTags.push(name);
            lastOpenedTag = name;
         },
         onclosetag(name) {
            const lastTag = openTags.pop();
            if (lastTag !== name) {
               isValid = false; // Tag mismatch or unclosed tag detected
            }
         },
         ontext(text) {
            // If there's an open tag without a closing tag and the text is found, it's an issue.
            if (lastOpenedTag && text.includes('<')) {
               isValid = false;
            }
         },
         onend() {
            if (openTags.length > 0) {
               isValid = false; // There are still unclosed tags
            }
         }
      }, {decodeEntities: true});

      parser.write(input);
      parser.end();

      return isValid;
   }

}
