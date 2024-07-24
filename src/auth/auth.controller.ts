import { Controller, Post, Body, UsePipes, ValidationPipe, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from "./dto/login-auth.dto";
import { Auth } from "@prisma/client";
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import {CorrectUserCredentials, IncorrectUserCredentials} from "../user/dto/responce-user.dto";

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
   async login(@Body() loginDto: LoginUserDto): Promise<Auth> {
      return this.authService.login(loginDto);
   }
}
