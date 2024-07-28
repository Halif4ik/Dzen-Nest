import {Injectable, Logger} from '@nestjs/common';
import {PaginationsDto} from './dto/create-post.dto';
import {PrismaService} from "../prisma.service";
import {ConfigService} from "@nestjs/config";
import {UserService} from "../user/user.service";
import {Post} from "@prisma/client";

@Injectable()

export class PostsService {
   private readonly logger: Logger = new Logger(PostsService.name);

   constructor(private userService: UserService, private prisma: PrismaService,
               private readonly configService: ConfigService) {
   }

   async findAll(paginationsDto: PaginationsDto): Promise<any> {
      const {page, revert, start, limit} = paginationsDto;
      const order = revert ? 'desc' : 'asc';
      const lim: number = limit || this.configService.get<number>("PAGE_PAGINATION") || 1;

      const amountAll: number = await this.prisma.post.count();
      console.log('skip-', page ? (page - 1) * lim : start);
      console.log('take-', lim);
      console.log('orderBy-', order);

      const posts: Post[] = await this.prisma.post.findMany({
         skip: page ? (page - 1) * lim : start,
         take: +lim,
         orderBy: {
            id: order,
         },
         include: {user: true},
      });
      this.logger.log(`Getted- ${amountAll} posts`);

      return {
         posts,
         loginOfCurrentUser: 'tempUser',
         amountPage: Math.ceil(amountAll / lim) || 1,
      };
   }
}
