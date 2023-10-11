import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const BusinessUser = createParamDecorator((data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
});
