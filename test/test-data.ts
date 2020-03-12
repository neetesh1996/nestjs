import { UserLoginRequestDto } from './../src/users/dto/user-login-request.dto';
import { UpdateUserDto } from './../src/users/dto/update-user.dto';
import { UserLoginResponseDto } from './../src/users/dto/user-login-response.dto';
import { UserDto } from './../src/users/dto/user.dto';
import { Role } from '../src/shared/enum/role';
import { CreateUserDto } from './../src/users/dto/create-user.dto';

export const createUserDto1: CreateUserDto = {
    email: 'testemail@gmail.com',
    password: 'password123',
    name: 'John',
    userName: 'Smith',
    role: Role.user,
};

export const createUserDto2 = {
    email: 'testemail@gmail.com',
    password: 'password123',
    userName: 'Smith',
    role: Role.user,
};

export const createUserDto3 = {
    ...createUserDto1,
    email: 'not-email',
};

export const createUserDto4 = {
    ...createUserDto1,
    birthday: 'not-valid-date',
};

export const createUserDto5 = {
    ...createUserDto1,
    role: 'not-valid-role',
};

export const userLoginRequestDto1: UserLoginRequestDto = {
    email: createUserDto1.email,
    password: createUserDto1.password,
};

export const userLoginRequestDto2: UserLoginRequestDto = {
    email: 'wrong-email',
    password: createUserDto1.password,
};

export const userLoginRequestDto3: UserLoginRequestDto = {
    email: 'wrong-email',
    password: createUserDto1.password,
};

export const userDto1: UserDto = {
    id: 'uuid/v4',
    email: 'testemail@gmail.com',
    name: 'John',
    userName: 'Smith',
    role: Role.user,
};

export const userLoginResponseDto1: UserLoginResponseDto = {
    ...userDto1,
    token: 'token',
};

export const updateUserDto1: UpdateUserDto = {
    role: Role.user,
};

export const userDto2: UserDto = {
    ...userDto1,
    role: Role.user,
};
