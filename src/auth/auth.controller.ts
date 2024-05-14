import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Headers, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { GetUser } from './decorators/get-user-decorator';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Get('verify')
  @UseGuards(AuthGuard())
  verify(@GetUser() user: User) {
    return this.authService.verify(user)
  }

  @Get('users')
  findAll() {
    return this.authService.findAll();
  }

  @Post('register')
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async google(@Req() req) { }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.google(req)
  }

  @Post('login')
  findOne(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Patch('user/:id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateUserDto) {
    return this.authService.update(id, updateAuthDto);
  }

  @Delete('user/:id')
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }
}