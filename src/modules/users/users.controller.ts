import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res, NotFoundException, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/role.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../enums/roles.enum';
import { Request, Response } from 'express';
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
  @HttpCode(HttpStatus.OK)
  async findByName(@Param('full_name') full_name: string, @Req() req: Request): Promise<
    { success: boolean, message: string, data: object }
  > {

    const user = await this.usersService.findByName(full_name, req.user?.id)

    return {
      success: true,
      message: 'Successfully get user profile',
      data: user,
    };
  }


  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }


  @Get('profile')
  getProfile(@Req() req: Request, @Res() res: Response) {
    const user = req?.user
    delete user.password
    res.status(200).json({ success: true, message: 'Successfull get user profile', data: user })
  }


  @Patch('user-profile')
  async updateUserProfile(@Body() updateUserProfileDto: UpdateUserProfileDto, @Req() req: Request, @Res() res: Response) {
    const data = await this.usersService.updateUserProfile(req?.user, updateUserProfileDto);

    res.status(200).json({ success: true, message: 'Successfull update user profile', data })
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
