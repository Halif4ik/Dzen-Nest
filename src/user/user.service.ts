import {HttpException, HttpStatus, Injectable, Logger, OnApplicationBootstrap} from '@nestjs/common';
import {PrismaService} from '../prisma.service';
import {ConfigService} from "@nestjs/config";
import {Customer} from "@prisma/client";
import {CreateUserDto} from "./dto/create-user.dto";

@Injectable()
export class UserService {
   private readonly logger: Logger = new Logger(UserService.name);
   private readonly arrHexsFaces = ['👩‍🦰'.codePointAt(0), '👨‍🦲'.codePointAt(0), '👲'.codePointAt(0), `👧`.codePointAt(0)];

   constructor(private prisma: PrismaService, private readonly configService: ConfigService) {
   }

   async createUser(createUserDto: CreateUserDto): Promise<Customer> {
      const userInDB: Customer | null = await this.prisma.customer.findUnique({
         where: {
            email: createUserDto.email,
         },
      })
      if (userInDB)
         throw new HttpException('User with this device id already exist in db', HttpStatus.CONFLICT);

      const newUser: Customer = await this.prisma.customer.create({
         data: {
            email:createUserDto.email,
            userName:createUserDto.userName,
            homePage:createUserDto.homePage,
            pass:createUserDto.pass,
            face:createUserDto.face || this.arrHexsFaces[Math.floor(Math.random() * (this.arrHexsFaces.length - 1))]
         },
      });

      this.logger.log(`Created new user- ${newUser.id}`);
      return newUser
   }

}
