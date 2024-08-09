import {
   HttpException,
   HttpStatus,
   Injectable,
   Logger,
   UnauthorizedException
} from '@nestjs/common';
import * as bcrypt from "bcryptjs";
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
         }
      })
      if (userInDB)
         throw new HttpException('User with this e-mail already exist in db', HttpStatus.CONFLICT);

      const newUser = await this.prisma.customer.create({
         data: {
            email: createUserDto.email,
            userName: createUserDto.userName,
            homePage: createUserDto.homePage,
            pass: await bcrypt.hash(createUserDto.pass, 5),
            face: createUserDto.face || this.arrHexsFaces[Math.floor(Math.random() * (this.arrHexsFaces.length - 1))]
         },
      });

      this.logger.log(`Created new user- ${newUser.id}`);
      return {
         ...newUser,
         pass: '',
      }
   }

   async getUserByEmailWithAuth(email: string): Promise<Customer> {
      const userFromBd = await this.prisma.customer.findUnique({
         where: {email},
         include: {auth: true},
      });
      if (!userFromBd) throw new UnauthorizedException({message: "Incorrect credentials"});
      return userFromBd;
   }


   async getUserById(userId: number): Promise<Customer | null> {
      return this.prisma.customer.findUnique({where: {id: userId}});
   }


   async getUserByIdCompTargInviteRole(id: number): Promise<Customer | null> {
      return this.prisma.customer.findUnique({
         where: {id},
         include: {post: true},
      });
   }
}
