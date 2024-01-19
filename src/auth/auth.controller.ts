import { Body, Controller, Post } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/authCredentials.dto';
import { LoginCredentialsDto } from './dto/loginCredentials.dto';
import { AuthService } from './auth.service';
import { User } from 'src/user/user.entity';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
@ApiTags('Auth routes')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register user' })
  @ApiCreatedResponse({
    description: 'User registered',
  })
  @ApiConflictResponse({
    description: 'Email is allready used',
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @ApiBody({ type: AuthCredentialsDto })
  register(@Body() authCredentials: AuthCredentialsDto): Promise<User> {
    return this.authService.registerUser(authCredentials);
  }

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 201,
    description: 'User logged in',
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @ApiBody({ type: LoginCredentialsDto })
  @Post('/login')
  login(
    @Body() loginCredentials: LoginCredentialsDto,
  ): Promise<{ token: string }> {
    return this.authService.loginUser(loginCredentials);
  }
}
