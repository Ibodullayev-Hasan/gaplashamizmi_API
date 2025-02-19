import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {

  constructor(
    private readonly usersService: UsersService
  ) { }

  // create new user
  @Post('create')
  async create(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
    const { user, tokens } = await this.usersService.create(createUserDto);

    // refresh_token ni cookie-ga yozish
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: Number(process.env.JWT_REFRESH_EXPIRES_TIME) * 1000
    });

    return { user, access_token: tokens.access_token };
  }


  //// Get user profile
  @UseGuards(JwtAuthGuard)
  @Get('profile/me')
  async userProfile(@Req() request: Request): Promise<User> {
    return this.usersService.getMeProfile(request)
  }


  // all users
  @Get('all')
  async allUsersData(): Promise<User[]> {
    return this.usersService.allUsersData()
  }

  // search user by id
  @Get('id/:id')
  async findOneByUserId(@Param('id', ParseIntPipe) id: number): Promise<Partial<User>> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
