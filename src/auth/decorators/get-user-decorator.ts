import { createParamDecorator, ExecutionContext } from '@nestjs/common'


export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext) => {

    const req = ctx.switchToHttp().getRequest()
    const user = req.user.toJSON()
    delete user.password

    return user
  }
)