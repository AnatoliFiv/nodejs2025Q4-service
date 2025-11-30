import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersInMemoryRepository } from './repositories/users.in-memory.repository';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'IUsersRepository',
      useClass: UsersInMemoryRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
