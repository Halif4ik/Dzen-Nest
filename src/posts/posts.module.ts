import {Module} from '@nestjs/common';
import {PostsService} from './posts.service';
import {PostsController} from './posts.controller';
import {PrismaService} from "../prisma.service";
import {UserModule} from "../user/user.module";
import {ConfigModule} from "@nestjs/config";
import {FileService} from "./file.service";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {JwtStrategyAuth} from "../auth/jwt.strategy";

@Module({
   controllers: [PostsController],
   providers: [PostsService, PrismaService, FileService, JwtStrategyAuth],
   imports: [
      UserModule,
      ConfigModule,
      JwtModule, PassportModule
   ],
   exports: [PostsService]
})

export class PostsModule {
}
