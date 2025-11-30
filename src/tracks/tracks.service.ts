import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { ITracksRepository } from './repositories/tracks.repository.interface';
import { Track } from './entities/track.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class TracksService {
  constructor(
    @Inject('ITracksRepository')
    private readonly tracksRepository: ITracksRepository,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  async findAll(): Promise<Track[]> {
    return this.tracksRepository.findAll();
  }

  async findById(id: string): Promise<Track> {
    const track = await this.tracksRepository.findById(id);
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    return track;
  }

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    return this.tracksRepository.create({
      name: createTrackDto.name,
      duration: createTrackDto.duration,
      artistId: createTrackDto.artistId ?? null,
      albumId: createTrackDto.albumId ?? null,
    });
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    await this.findById(id);
    const updatedTrack = await this.tracksRepository.update(id, updateTrackDto);
    if (!updatedTrack) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    return updatedTrack;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.tracksRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }

    await this.favoritesService.removeTrack(id, true);
  }

  async removeArtistReferences(artistId: string): Promise<void> {
    const tracks = await this.tracksRepository.findAll();
    const tracksToUpdate = tracks.filter((t) => t.artistId === artistId);

    await Promise.allSettled(
      tracksToUpdate.map((track) =>
        this.tracksRepository.update(track.id, { artistId: null }),
      ),
    );
  }

  async removeAlbumReferences(albumId: string): Promise<void> {
    const tracks = await this.tracksRepository.findAll();
    const tracksToUpdate = tracks.filter((t) => t.albumId === albumId);

    await Promise.allSettled(
      tracksToUpdate.map((track) =>
        this.tracksRepository.update(track.id, { albumId: null }),
      ),
    );
  }
}
