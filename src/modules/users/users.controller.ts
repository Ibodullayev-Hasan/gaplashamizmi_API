import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res, NotFoundException, HttpCode, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/role.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../enums/roles.enum';
import { Request, Response, Express } from 'express';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { SpacesService } from '../../common/services/spaces.service';
import { FileSizeValidationPipe, FileTypeValidationPipe } from '../../common/pipes';

@UseGuards(AuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly spacesService: SpacesService
  ) { }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile(
      new FileSizeValidationPipe(),
      new FileTypeValidationPipe(['image/jpeg', 'image/png', 'image/jpg']),
    ) file: Express.Multer.File,
  ) {
    const imageUrl = await this.spacesService.uploadFile(file);
    return {
      success: true,
      imageUrl,
    };
  }


  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }


  @Get('name/:searchTerm')
  @HttpCode(HttpStatus.OK)  
  async findByName(@Param('searchTerm') searchTerm: string, @Req() req: Request, @Res() res: Response) {

    const user = await this.usersService.findByName(searchTerm, req.user?.id)

    res.status(200).json({ success: true, message: 'Successfull get users data', data: user })
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
