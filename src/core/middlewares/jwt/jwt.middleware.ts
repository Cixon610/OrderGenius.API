import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserPayload } from 'src/core/models';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: any, res: any, next: () => void) {
    if (req.headers.authorization) {
      let token = req.headers.authorization.split(' ')[1];
      const decodedToken = this.jwtService.decode(token) as any;

      // Check if the token will expire in the next hour
      const expired = decodedToken.exp < Math.floor(Date.now() / 1000) + 3600;
      if (expired) {
        const userPayload: IUserPayload = {
          id: decodedToken.id,
          username: decodedToken.username,
          role: decodedToken.role,
          businessId: decodedToken.businessId,
        };

        // If the token will expire in the next hour, generate a new one with extended validity
        token = this.jwtService.sign(userPayload, { expiresIn: '1d' }); // Set the token to expire in 1 day

      }
      // Add the new token to the response headers
      res.setHeader('Authorization', `Bearer ${token}`);
    }
    next();
  }
}
