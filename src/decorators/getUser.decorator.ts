import { ExecutionContext, createParamDecorator } from '@nestjs/common';

// a decorator function to get the details of the current login user
export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();

    if (data) return request.user[data];

    return request.user;
  },
);
