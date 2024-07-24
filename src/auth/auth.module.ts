import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule} from "@nestjs/config";
import {PassportModule} from "@nestjs/passport";
import {UserModule} from "../user/user.module";
import {PrismaService} from "../prisma.service";


@Module({
   controllers: [AuthController],
   providers: [AuthService, PrismaService],
   imports: [
      UserModule,
      ConfigModule,
      JwtModule, PassportModule
   ],

})
export class AuthModule {
}
