import { UserLoginRequestDto } from './dto/user-login-request.dto';
import {
    Controller,
    Get,
    Post,
    Body,
    HttpCode,
    Delete,
    Req,
    UseGuards,
    Put,
    Param,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { ApiUseTags, ApiOkResponse,  ApiBearerAuth, ApiImplicitParam } from '@nestjs/swagger';
import { UserLoginResponseDto } from './dto/user-login-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@ApiUseTags('users')
export class UsersController {
    constructor(private readonly usersService: UsersService,
        ) {}

    @Post('register')
     @ApiOkResponse({ type: UserLoginResponseDto })
    register(
        @Body() createUserDto: CreateUserDto,
    ): Promise<UserLoginResponseDto> {
        return this.usersService.create(createUserDto);
    }

    @Post('login')
    @HttpCode(200)
    @ApiOkResponse({ type: UserLoginResponseDto })
    login(
        @Body() userLoginRequestDto: UserLoginRequestDto,
    ): Promise<UserLoginResponseDto> {
        return this.usersService.login(userLoginRequestDto);
    }

    @Get()
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt') )
    @ApiOkResponse({ type: [UserDto] })
   async findAll(@Req() request): Promise<UserDto[]> {
        return this.usersService.findAll(request.user.id);
    }

    @Get('me')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOkResponse({ type: UserDto })
    async getUser(@Req() request): Promise<UserDto> {
        return this.usersService.getUser(request.user.id);
    }

    @Put('/:id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiImplicitParam({ name: 'id', required: true })
    @ApiOkResponse({ type: UserDto })
   async update(
        @Body() updateUserDto: UpdateUserDto,
        @Req() request,
        @Param() params,
    ): Promise<UserDto> {
        return this.usersService.update(request.user.id, updateUserDto, params.id);
    }

    @Get('email/:id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiImplicitParam({ name: 'id', required: true })
    @ApiOkResponse({ type: UserDto })
    email(@Req() request,
          @Param() params,
    ): Promise<UserDto> {
        return this.usersService.email(request.user.id, params.id);
    }

    @Delete('/:id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiImplicitParam({ name: 'id', required: true })
    @ApiOkResponse({ type: UserDto })
    delete(@Req() request,
           @Param() params,
    ): Promise<UserDto> {
        return this.usersService.delete(request.user.id, params.id);
    }
}
