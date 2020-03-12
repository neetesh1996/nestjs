import {
    Table,
    Column,
    Model,
    Unique,
    IsEmail,
    DataType,
    CreatedAt,
    UpdatedAt,
    // DeletedAt,
    HasMany,
} from 'sequelize-typescript';
import { Role } from '../shared/enum/role';
import { Post } from './../posts/post.entity';

@Table({
    tableName: 'user',
})
export class User extends Model<User> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    id: string;

    @Column({ field: 'name' })
    name: string;

    @Column({ field: 'user_name' })
    userName: string;

    @Column({ type: DataType.ENUM(Role.user, Role.admin) })
    roles: Role;

    @Unique
    @IsEmail
    @Column
    email: string;

    @Column
    password: string;

    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updatedAt: Date;

    // @DeletedAt
    // @Column({ field: 'deleted_at' })
    // deletedAt: Date;

    @HasMany(() => Post)
    posts: Post[];
}
