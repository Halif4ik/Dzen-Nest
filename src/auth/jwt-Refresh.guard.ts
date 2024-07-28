import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {UserService} from "../user/user.service";
import {ConfigService} from "@nestjs/config";
import {Customer} from "@prisma/client";

@Injectable()
export class JwtAuthRefreshGuard implements CanActivate {
   constructor(private jwtService: JwtService, private readonly userService: UserService,
               private readonly configService: ConfigService) {
   }

   /*decode with Key word for ONLY refreshToken */
   async canActivate(context: ExecutionContext): Promise<any> {
      const req = context.switchToHttp().getRequest();
      try {
         const authHeder = req.headers.authorization;
         let bearer, token;
         if (authHeder) {
            bearer = authHeder.split(" ")[0];
            token = authHeder.split(" ")[1];
         }
         if (bearer !== "Bearer" || !token) throw new UnauthorizedException(
             {
                success: false,
                errors_message: "Unexpected token",
                data: null,
             });

         let userFromJwt = this.jwtService.verify(token, {secret: this.configService.get<string>("SECRET_REFRESH")});

         /*because in jwt always present id*/
         const userFromBd: Customer | null = userFromJwt['email'] ? await this.userService.getUserById(userFromJwt['id']) : null;

         req.user = userFromBd;
         return req.user;
      } catch (e) {
         /*console.log("!!e-", e);
         todo app.useGlobalFilters(new AllExceptionsFilter(),); */
         throw new UnauthorizedException(
             {
                success: false,
                errors_message: e ? e : "User doesnt authorized",
                data: null,
             });
      }
   }
}