import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/role.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../enums/roles.enum';
import { Request } from 'express';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@UseGuards(AuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }


  @Get('name/:full_name')
  findByName(@Param('full_name') full_name: string) {
    return this.usersService.findByName(full_name);
  }


  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }


  @Get('profile')
  @Roles(UserRole.USER)
  getProfile(@Req() req: Request) {
    const user = req?.user
    delete user.password
    return user
  }
  
  
  @Patch()
  @Roles(UserRole.USER)
  update(@Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
    const id = req?.user.id
    return this.usersService.update(id, updateUserDto);
  }
  
  @Patch('user-profile')
  @Roles(UserRole.USER)
  updateUserProfile(@Body() updateUserProfileDto: UpdateUserProfileDto, @Req() req: Request) {
    return this.usersService.updateUserProfile(req?.user, updateUserProfileDto);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
