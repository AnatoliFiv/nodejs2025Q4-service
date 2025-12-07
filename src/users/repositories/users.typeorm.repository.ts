import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.typeorm.entity';
import { User } from '../entities/user.entity';
import { IUsersRepository } from './users.repository.interface';

@Injectable()
export class UsersTypeOrmRepository implements IUsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<User[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => this.toDomain(entity));
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async create(
    userData: Omit<User, 'id' | 'version' | 'createdAt' | 'updatedAt'>,
  ): Promise<User> {
    const entity = this.repository.create({
      id: crypto.randomUUID(),
      ...userData,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) return null;

    Object.assign(entity, updates);
    entity.updatedAt = Date.now();

    if (updates.version !== undefined) {
      entity.version = updates.version;
    }

    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== undefined && result.affected > 0;
  }

  private toDomain(entity: UserEntity): User {
    const { id, login, password, version, createdAt, updatedAt } = entity;
    return { id, login, password, version, createdAt, updatedAt };
  }
}
