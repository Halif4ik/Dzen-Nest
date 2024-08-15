import {Injectable, Logger} from '@nestjs/common';
import {CreateCommitDto} from './dto/create-commit.dto';
import {UserService} from "../user/user.service";
import {PrismaService} from "../prisma.service";
import {FileElementResponse, FileService} from "../posts/file.service";
import {ConfigService} from "@nestjs/config";
import {Customer, Posts, Commit} from "@prisma/client";
import {PostsService} from "../posts/posts.service";

@Injectable()
export class CommitService {
   private readonly logger: Logger = new Logger(CommitService.name);

   constructor(private userService: UserService,
               private prisma: PrismaService,
               private fileService: FileService,
               private readonly postService: PostsService,
               private readonly configService: ConfigService) {
   }

   async create(createCommitDto: CreateCommitDto, userFromGuard: Customer, imageOrText: Express.Multer.File[]): Promise<Commit> {
      const sevedFileData: FileElementResponse | null = await this.postService.resizeAndWriteToDisk(imageOrText[0]);

      const newCommit: Commit = await this.prisma.commit.create({
         data: {
            text: createCommitDto.text,
            attachedFile: sevedFileData?.name || '',
            userId: userFromGuard.id,
            postId: createCommitDto.post_id,
            parentCommId: createCommitDto.parent_comment_id || null,
            checkedCom: false,
         },
      });
      /*if we creaded new commit we should resend all post by WS*/
      await this.postService.takePostSendNotification(userFromGuard.id, createCommitDto.post_id);

      this.logger.log(`Created new Commit- ${newCommit.id} for post- ${newCommit.postId}`);
      return newCommit;
   }

}
