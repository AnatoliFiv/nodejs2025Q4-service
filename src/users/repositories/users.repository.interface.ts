import { User } from '../entities/user.entity';
import { IBaseRepository } from '../../common/repositories/base.repository.interface';

export interface IUsersRepository
  extends IBaseRepository<
    User,
    Omit<User, 'id' | 'version' | 'createdAt' | 'updatedAt'>
  > {
  findByLogin(login: string): Promise<User | null>;
}
