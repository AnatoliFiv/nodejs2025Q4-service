import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.typeorm.entity';
import { UsersTypeOrmRepository } from './repositories/users.typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersTypeOrmRepository,
    {
      provide: 'IUsersRepository',
      useClass: UsersTypeOrmRepository,
    },
  ],
  exports: [UsersService, 'IUsersRepository'],
})
export class UsersModule {}
