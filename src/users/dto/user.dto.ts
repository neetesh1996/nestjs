import { User } from './../user.entity';
import { Role } from '../../shared/enum/role';
import { ApiModelProperty } from '@nestjs/swagger';

export class UserDto {
    @ApiModelProperty()
    id: string;

    @ApiModelProperty()
    readonly name: string;

    @ApiModelProperty()
    readonly userName: string;

    @ApiModelProperty()
    readonly roles: Role;

    @ApiModelProperty()
    readonly email: string;

    constructor(user: User) {
        this.id = user.id;
        this.name = user.name;
        this.userName = user.userName;
        this.roles = user.roles;
        this.email = user.email;
    }
}
