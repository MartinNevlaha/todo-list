import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthCredentialsDto } from './dto/authCredentials.dto';
import { LoginCredentialsDto } from './dto/loginCredentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async registerUser(
    authCredentials: AuthCredentialsDto,
  ): Promise<{ message: string }> {
    const { passwordConfirm, ...data } = authCredentials;

    if (data.password !== passwordConfirm) {
      throw new BadRequestException(
        'Password and confirm password do not match',
      );
    }
    return this.userService.createUser(data.email, data.password);
  }

  async loginUser(
    loginCredentials: LoginCredentialsDto,
  ): Promise<{ token: string }> {
    const { email, password } = loginCredentials;
    const user = await this.userService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { id: user.id };
      const token = await this.jwtService.sign(payload);
      return { token };
    } else {
      throw new UnauthorizedException();
    }
  }
}
