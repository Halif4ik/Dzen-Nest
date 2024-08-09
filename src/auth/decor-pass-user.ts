import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {Customer} from "@prisma/client";

/*get from request where put guard*/
export const UserDec = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): Customer => {
       const request = ctx.switchToHttp().getRequest();
       return request.user;
    },
);

