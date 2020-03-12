import {
    IsString,
    IsEmail,
    IsEnum,
    IsOptional,
    MinLength,
} from 'class-validator';
import { Role } from '../../shared/enum/role';
import { ApiModelProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiModelProperty()
    @IsString()
    readonly name: string;

    @ApiModelProperty()
    @IsString()
    readonly userName: string;

    @ApiModelProperty()
    @IsOptional()
    @IsEnum(Role)
    readonly roles: Role;

    @ApiModelProperty()
    @IsEmail()
    readonly email: string;

    @ApiModelProperty()
    @IsString()
    @MinLength(6)
    readonly password: string;

}
