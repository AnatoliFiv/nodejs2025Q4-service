import { Injectable } from '@nestjs/common';
import { IUsersRepository } from './users.repository.interface';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersInMemoryRepository implements IUsersRepository {
  private users: User[] = [];

  async findAll(): Promise<User[]> {
    return [...this.users];
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null;
  }

  async create(
    userData: Omit<User, 'id' | 'version' | 'createdAt' | 'updatedAt'>,
  ): Promise<User> {
    const newUser: User = {
      id: crypto.randomUUID(),
      ...userData,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.users.push(newUser);
    return newUser;
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    this.users[index] = {
      ...this.users[index],
      ...updates,
      updatedAt: Date.now(),
    };
    return this.users[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return false;

    this.users.splice(index, 1);
    return true;
  }

  async findByLogin(login: string): Promise<User | null> {
    return this.users.find((user) => user.login === login) || null;
  }
}
