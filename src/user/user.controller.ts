import {Body, Controller, HttpCode, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import { UserService } from './user.service';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {ConfigService} from "@nestjs/config";
import {UserClass} from "./entities/user.entity";
import {CreateUserDto} from "./dto/create-user.dto";
import {Customer} from "@prisma/client";

@ApiTags('CRUD User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,private readonly configService: ConfigService) {}

  //1.All Users can create new account
  //Endpoint: Post /api/v1/user/create
  @Post('create')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'User created successfully',
    type: UserClass,
  })
  @ApiOperation({summary: 'Created User in database'})
  @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
  createUser(@Body() createUserDto: CreateUserDto): Promise<Customer> {
    return this.userService.createUser(createUserDto);
  }
}



