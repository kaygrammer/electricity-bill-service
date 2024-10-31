import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../users/user.model';
import { RegisterUserDto, LoginUserDto } from './dto/register-user.dto';
import { ApiResponse } from 'src/responses/api-response.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<
    ApiResponse<{
      id: string;
      email: string;
      name: string;
      accessToken: string;
    }>
  > {
    const { email, name, password } = registerUserDto;
    const { user, accessToken } = await this.authService.register(email, name, password);

    return {
      success: true,
      message: 'User registration successful',
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        accessToken,
      },
    };
  }

  @Post('login')
  async login(@Body() loginDto: LoginUserDto): Promise<ApiResponse<{ accessToken: string }>> {
    const { email, password } = loginDto;
    const tokenData = await this.authService.login(email, password);

    return {
      success: true,
      message: 'Login successful',
      data: tokenData,
    };
  }
}
