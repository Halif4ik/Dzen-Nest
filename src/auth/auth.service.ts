import {HttpStatus, Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import {LoginUserDto} from "./dto/login-auth.dto";
import {ConfigService} from "@nestjs/config";
import {PrismaService} from "../prisma.service";
import {Customer} from "@prisma/client";
import {TJwtBody} from "../user/interface/customResponces";
import {Auth} from "@prisma/client";

@Injectable()
export class AuthService {
   private readonly logger: Logger = new Logger(AuthService.name);

   constructor(private userService: UserService, private jwtService: JwtService,
               private prisma: PrismaService, private readonly configService: ConfigService) {
   }

   async login(loginDto: LoginUserDto): Promise<Auth> {
      // should rewrite all tokens return one token
      const userFromBd: Customer = await this.userService.getUserByEmailWithAuth(loginDto.email);
      await this.checkUserCredentials(userFromBd, loginDto);

      return this.containOrRefreshTokenAuthBd(userFromBd);
   }

   async refresh(userFromBd: Customer): Promise<Auth> {
      this.logger.log(`Refreshed token for user- ${userFromBd.email}`);
      return this.containOrRefreshTokenAuthBd(userFromBd);
   }

   private async containOrRefreshTokenAuthBd(userFromBd: Customer): Promise<Auth> {
      const jwtBody: TJwtBody = {
         email: userFromBd.email,
         id: userFromBd.id,
         userName: userFromBd.userName,
      }
      const action_token: string = this.jwtService.sign(jwtBody,
          {
             expiresIn: this.configService.get<string>("EXPIRE_ACTION"),
             secret: this.configService.get<string>("SECRET_ACTION")
          });
      const refreshToken: string = this.jwtService.sign(jwtBody,
          {
             expiresIn: this.configService.get<string>("EXPIRE_REFRESH"),
             secret: this.configService.get<string>("SECRET_REFRESH")
          });
      const accessToken: string = this.jwtService.sign(jwtBody,
          {
             expiresIn: this.configService.get<string>("EXPIRE_ACCESS"),
             secret: this.configService.get<string>("SECRET_ACCESS")
          });

      const userAuthData = await this.prisma.auth.upsert({
         where: {
            userId: userFromBd.id,
         },
         update: {
            refreshToken: refreshToken,
            accessToken,
            action_token,
         },
         create: {
            refreshToken,
            accessToken,
            action_token,
            userId: userFromBd.id,
         },
      });
      this.logger.log(`Created tokens for userId- ${userFromBd.id}`);
      return userAuthData;
   }

   private async checkUserCredentials(userFromBd: Customer | null, loginDto: LoginUserDto): Promise<void> {
      if (!userFromBd) throw new UnauthorizedException({message: "Incorrect credentials"});
      const passwordCompare = await bcrypt.compare(loginDto.pass, userFromBd.pass);
      if (!passwordCompare) throw new UnauthorizedException({message: "Incorrect credentials"});
   }


}
