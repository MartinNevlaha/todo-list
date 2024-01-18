import { Body, Controller, Post } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/authCredentials.dto';
import { LoginCredentialsDto } from './dto/loginCredentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  register(
    @Body() authCredentials: AuthCredentialsDto,
  ): Promise<{ message: string }> {
    return this.authService.registerUser(authCredentials);
  }

  @Post('/login')
  login(
    @Body() loginCredentials: LoginCredentialsDto,
  ): Promise<{ token: string }> {
    return this.authService.loginUser(loginCredentials);
  }
}
