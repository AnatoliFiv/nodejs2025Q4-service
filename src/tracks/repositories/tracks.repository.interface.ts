import { Track } from '../entities/track.entity';
import { IBaseRepository } from '../../common/repositories/base.repository.interface';

export type ITracksRepository = IBaseRepository<Track>;
