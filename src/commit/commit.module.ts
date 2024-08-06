import {Module} from '@nestjs/common';
import {CommitService} from './commit.service';
import {CommitController} from './commit.controller';
import {PrismaService} from "../prisma.service";
import {FileService} from "../posts/file.service";
import {JwtStrategyAuth} from "../auth/jwt.strategy";
import {UserModule} from "../user/user.module";
import {ConfigModule} from "@nestjs/config";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {PostsModule} from "../posts/posts.module";

@Module({
   controllers: [CommitController],
   providers: [CommitService, PrismaService, FileService, JwtStrategyAuth],
   imports: [
      UserModule,
      PostsModule,
      ConfigModule,
      JwtModule, PassportModule
   ],
})
export class CommitModule {
}
