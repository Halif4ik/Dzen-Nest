import {Body, Controller, HttpCode, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import { UserService } from './user.service';
import {ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {ConfigService} from "@nestjs/config";
import {UserClass} from "./entities/user.entity";
import {CreateUserDto} from "./dto/create-user.dto";
import {Customer} from "@prisma/client";
import {UserExistResponseClass, UserResponseClass} from "./dto/responce-user.dto";

@ApiTags('CRUD User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //1.All Users can create new account
  //Endpoint: Post /api/v1/user/register
  @Post('register')
  @HttpCode(200)
  @ApiOkResponse({
    status: 200,
    description: "User created successfully",
    type: UserResponseClass
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "User already exist in db",
    type: UserExistResponseClass
  })
  @ApiOperation({summary: 'Created User in database'})
  @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
  createUser(@Body() createUserDto: CreateUserDto): Promise<Customer> {
    return this.userService.createUser(createUserDto);
  }
}



