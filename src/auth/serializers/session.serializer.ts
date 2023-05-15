import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  serializeUser(user: any, done: (err: Error, user: any) => void) {
    done(null, { id: user.id });
  }

  async deserializeUser(
    payload: any,
    done: (err: Error, payload: any) => void,
  ) {
    const user = await this.userService.findById(payload.id);
    delete user.passwordHash;
    done(null, user);
  }
}
