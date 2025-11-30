import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { IUsersRepository } from './repositories/users.repository.interface';
import { User, UserResponseDto } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.findAll();
    return users.map((user) => this.excludePassword(user));
  }

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.excludePassword(user);
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersRepository.create({
      login: createUserDto.login,
      password: createUserDto.password,
    });
    return this.excludePassword(user);
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is wrong');
    }

    const updatedUser = await this.usersRepository.update(id, {
      password: updatePasswordDto.newPassword,
      version: user.version + 1,
    });

    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.excludePassword(updatedUser);
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.usersRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  private excludePassword(user: User): UserResponseDto {
    const { password: _password, ...rest } = user;
    return rest;
  }
}
