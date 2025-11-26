import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ActiveUserData } from '../../auth/types/active-user-data.type';

export const CurrentUser = createParamDecorator(
  (data: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: ActiveUserData | undefined = request.user;
    return data ? user?.[data] : user;
  },
);
