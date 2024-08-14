import {ExtractJwt, Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {ConfigService} from '@nestjs/config';
import {Customer} from "@prisma/client";
import {TJwtBody} from "../user/interface/customResponces";

@Injectable()
export class JwtStrategyAuth extends PassportStrategy(Strategy, "jwt-auth") {
   constructor(private readonly userService: UserService,
               private readonly configService: ConfigService) {
      super({
         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
         ignoreExpiration: false,
         secretOrKey: configService.get<string>("SECRET_ACCESS"),

      });
   }

   async validate(payload: unknown): Promise<Customer | null> {
      if (typeof payload !== 'object' || payload === null) return null;
      // jwt Payload is missing a required property and this point, payload is of type TJwtBody
      const requiredProperties: (keyof TJwtBody)[] = ['id', 'email', 'userName'];
      for (const prop of requiredProperties) {
         if (!(prop in payload)) return null;
         if (prop === 'id' && typeof payload[prop] !== 'number') return null;
      }

      const jwtBody: TJwtBody = {
         email: payload['email'].toString(),
         id: +payload['id'] || 1,
         userName: payload['userName'].toString(),
         iat: +payload['iat'] || 1,
         exp: +payload['exp'] || 1
      };
      return this.userService.getUserByIdCompTargInviteRole(jwtBody.id);
   }
}