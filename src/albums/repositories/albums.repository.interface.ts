import { Album } from '../entities/album.entity';
import { IBaseRepository } from '../../common/repositories/base.repository.interface';

export type IAlbumsRepository = IBaseRepository<Album>;
