import { Module } from '@nestjs/common';
import * as path from "node:path";
import {ServeStaticModule} from "@nestjs/serve-static";
import {ConfigModule} from "@nestjs/config";
import {APP_INTERCEPTOR} from "@nestjs/core";
import {TransformResponseInterceptor} from "./interceptor/response.interceptor";
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { CommitModule } from './commit/commit.module';
import {NotificationsGateway} from "./posts/notifications.gateway";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '../public'),
    }),
    UserModule,
    AuthModule,
    PostsModule,
    CommitModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
    NotificationsGateway
  ],
})
export class AppModule {
}
