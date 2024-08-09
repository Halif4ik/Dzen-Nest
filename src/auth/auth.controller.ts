import {Controller, Post, Body, UsePipes, ValidationPipe, HttpCode, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from "./dto/login-auth.dto";
import {Auth, Customer} from "@prisma/client";
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import {CorrectUserCredentials, IncorrectUserCredentials} from "../user/dto/responce-user.dto";
import {JwtAuthRefreshGuard} from "./jwt-Refresh.guard";
import {UserDec} from "./decor-pass-user";


@Controller('auth')
export class AuthController {
   constructor(private readonly authService: AuthService) {}

   //1.Registered users can login in system  Promise<Auth>
   //Endpoint: Post /api/v1/auth/login
   @UsePipes(ValidationPipe)
   @Post('login')
   @HttpCode(200)
   @ApiOkResponse({
      status: 200,
      description: "User login successfully",
      type: CorrectUserCredentials
   })
   @ApiBadRequestResponse({
      status: 400,
      description: "Incorrect credentials",
      type: IncorrectUserCredentials
   })
   @ApiOperation({ summary: 'Login User' })
   @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
   async login(@Body() loginDto: LoginUserDto): Promise<Auth & { email: string }> {
      return this.authService.login(loginDto);
   }

   //2.Registered users can refresh expired ACCESS token with using his self email and refresh token
   //Endpoint: Post /api/v1/auth/refresh
   @Post("/refresh")
   @HttpCode(200)
   @ApiOkResponse({
      status: 200,
      description: "Refresh successfully",
      type: CorrectUserCredentials
   })
   @ApiBadRequestResponse({
      status: 400,
      description: "Incorrect credentials",
      type: IncorrectUserCredentials
   })
   @ApiOperation({ summary: 'Refresh tokens for user' })
   @UsePipes(ValidationPipe)
   @UseGuards(JwtAuthRefreshGuard)
   async refresh(@UserDec() userFromGuard: Customer): Promise<Auth & { email: string }> {
      return this.authService.refresh(userFromGuard);
   }

}
