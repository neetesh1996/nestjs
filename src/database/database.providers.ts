import { Sequelize } from 'sequelize-typescript';
import { User } from './../users/user.entity';
import { Post } from './../posts/post.entity';
import { ConfigService } from './../shared/config/config.service';
// it is a type of provider Factory providers: 'useFactory' syntax allows for creating providers dynamically
export const databaseProviders = [
    {
        provide: 'SEQUELIZE',
        useFactory: async (configService: ConfigService) => {
            const sequelize = new Sequelize(configService.sequelizeOrmConfig);
            sequelize.addModels([User, Post]);
            await sequelize.sync();
            return sequelize;
        },
        inject: [ConfigService],
    },
];
