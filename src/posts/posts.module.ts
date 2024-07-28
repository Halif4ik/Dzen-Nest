import {Module} from '@nestjs/common';
import {PostsService} from './posts.service';
import {PostsController} from './posts.controller';
import {PrismaService} from "../prisma.service";
import {UserModule} from "../user/user.module";
import {ConfigModule} from "@nestjs/config";

@Module({
   controllers: [PostsController],
   providers: [PostsService, PrismaService],
   imports: [
      UserModule,
      ConfigModule,
   ],
})
export class PostsModule {
}
