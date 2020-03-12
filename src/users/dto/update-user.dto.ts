import { Role } from '../../shared/enum/role';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';

export class UpdateUserDto {
  @ApiModelProperty()
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiModelProperty()
  @IsOptional()
  @IsString()
  readonly userName?: string;

  @ApiModelProperty()
  @IsOptional()
  @IsEnum(Role)
  readonly roles?: Role;

  @ApiModelProperty()
  @IsOptional()
  @IsString()
  readonly email?: string;
}
