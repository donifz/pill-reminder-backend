import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ 
    status: 200, 
    description: 'User has been successfully logged in.',
    schema: {
      properties: {
        access_token: { type: 'string' },
        user: { type: 'object' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid credentials.' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ 
    status: 201, 
    description: 'User has been successfully registered.',
    schema: {
      properties: {
        access_token: { type: 'string' },
        user: { type: 'object' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data.' })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'User has been successfully logged out.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout() {
    return { message: 'Logged out successfully' };
  }
} 