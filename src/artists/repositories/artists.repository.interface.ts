import { Artist } from '../entities/artist.entity';
import { IBaseRepository } from '../../common/repositories/base.repository.interface';

export type IArtistsRepository = IBaseRepository<Artist>;
