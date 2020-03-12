import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { User } from './user.entity';
import { genSalt, hash, compare } from 'bcrypt';
import { UserDto } from './dto/user.dto';
import { UserLoginRequestDto } from './dto/user-login-request.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginResponseDto } from './dto/user-login-response.dto';
import { JwtPayload } from './auth/jwt-payload.model';
import { sign } from 'jsonwebtoken';
import { UpdateUserDto} from './dto/update-user.dto';
import { ConfigService } from './../shared/config/config.service';
import { sendEmail } from './mail/user.mail';

@Injectable()
export class UsersService {
    private readonly jwtPrivateKey: string;

    constructor(
        @Inject('UsersRepository')
        private readonly usersRepository: typeof User,
        private readonly configService: ConfigService,
    ) {
        this.jwtPrivateKey = this.configService.jwtConfig.privateKey;
    }

    async findAll(id: string): Promise<UserDto[]> {
        const users = await this.usersRepository.findAll<User>();
        const user = await this.usersRepository.findByPk<User>(id);
        if (!(user.roles === 'admin')) {
            throw new HttpException('Required Admin Role!.', HttpStatus.UNAUTHORIZED);
        }
        return users.map(use => {
            return new UserDto(use);
        });
    }

    async getUser(id: string): Promise<UserDto> {
        const user = await this.usersRepository.findByPk<User>(id);
        if (!user) {
            throw new HttpException(
                'User with given id not found',
                HttpStatus.NOT_FOUND,
            );
        }

        return new UserDto(user);
    }

    async getUserByEmail(email: string): Promise<User> {
        return await this.usersRepository.findOne<User>({
            where: { email },
        });
    }

    async create(createUserDto: CreateUserDto): Promise<UserLoginResponseDto> {
        try {
            const user = new User();
            user.name = createUserDto.name;
            user.userName = createUserDto.userName;
            user.roles = createUserDto.roles;
            user.email = createUserDto.email.trim().toLowerCase();
            const salt = await genSalt(10);
            user.password = await hash(createUserDto.password, salt);

            const userData = await user.save();

            // when registering then log user in automatically by returning a token
            const token = await this.signToken(userData);
            return new UserLoginResponseDto(userData, token);
        } catch (err) {
            if (err.original.constraint === 'user_email_key') {
                throw new HttpException(
                    `User with email '${err.errors[0].value}' already exists`,
                    HttpStatus.CONFLICT,
                );
            }

            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async login(
        userLoginRequestDto: UserLoginRequestDto,
    ): Promise<UserLoginResponseDto> {
        const email = userLoginRequestDto.email;
        const password = userLoginRequestDto.password;

        const user = await this.getUserByEmail(email);
        // console.log("user"+user.email,email);
        if (!user) {
            throw new HttpException(
                'Invalid email or password.',
                HttpStatus.BAD_REQUEST,
            );
        }

        const isMatch = await compare(password, user.password);
        // console.log(password,user.password);
        if (!isMatch) {
            throw new HttpException(
                'Invalid  password.',
                HttpStatus.BAD_REQUEST,
            );
        }

        const token = await this.signToken(user);
        return new UserLoginResponseDto(user, token);
    }

    async update( id: string, updateUserDto: UpdateUserDto, pid: string ): Promise<any> {
        const puser = await this.usersRepository.findByPk<User>(id);
        const user = await this.usersRepository.findByPk<User>(pid);
        if (!(puser && user)) {
            throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
        }
        if (!(puser.roles === 'admin')) {
            throw new HttpException('Required Admin Role!.', HttpStatus.UNAUTHORIZED);
        }

        user.name = updateUserDto.name || user.name;
        user.userName = updateUserDto.userName || user.userName;
        user.roles = updateUserDto.roles || user.roles;
        user.email = updateUserDto.email || user.email;

        try {
            const data = await user.save();
            const dataJSON = JSON.stringify(data);
            return (`${user.name} record updated successfully  ${dataJSON}`);

        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async email(id: string, uid: string): Promise<any> {
        const puser = await this.usersRepository.findByPk<User>(id);
        const user = await this.usersRepository.findByPk<User>(uid);
        if (!(puser && user)) {
            throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
        }
        if (!(puser.roles === 'admin')) {
            throw new HttpException('Required Admin Role!.', HttpStatus.UNAUTHORIZED);
        }
        await sendEmail(puser.email, puser.name, user.email, user.name);
        return (`mail is sent to ${user.name} by ${puser.name}`);
    }
    async delete(id: string, uid: string): Promise<any> {
        const puser = await this.usersRepository.findByPk<User>(id);
        const user = await this.usersRepository.findByPk<User>(uid);
        if (!(puser && user)) {
            throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
        }
        if (!(puser.roles === 'admin')) {
            throw new HttpException('Required Admin Role!.', HttpStatus.UNAUTHORIZED);
        }
        await user.destroy();
        return (`${user.name} record deleted successfully `);
    }
    async signToken(user: User): Promise<string> {
        const payload: JwtPayload = {
            email: user.email,
        };

        const token = sign(payload, this.jwtPrivateKey, {});
        return token;
    }
}
