import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshTokenGuard extends AuthGuard('jwt-refresh-token') {
  private readonly logger = new Logger(JwtRefreshTokenGuard.name);

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
