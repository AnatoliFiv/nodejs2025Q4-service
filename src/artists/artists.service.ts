import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IArtistsRepository } from './repositories/artists.repository.interface';
import { Artist } from './entities/artist.entity';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class ArtistsService {
  constructor(
    @Inject('IArtistsRepository')
    private readonly artistsRepository: IArtistsRepository,
    private readonly albumsService: AlbumsService,
    private readonly tracksService: TracksService,
    private readonly favoritesService: FavoritesService,
  ) {}

  async findAll(): Promise<Artist[]> {
    return this.artistsRepository.findAll();
  }

  async findById(id: string): Promise<Artist> {
    const artist = await this.artistsRepository.findById(id);
    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    return artist;
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    return this.artistsRepository.create(createArtistDto);
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    await this.findById(id);
    const updatedArtist = await this.artistsRepository.update(
      id,
      updateArtistDto,
    );
    if (!updatedArtist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    return updatedArtist;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.artistsRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }

    await this.albumsService.removeArtistReferences(id);
    await this.tracksService.removeArtistReferences(id);
    await this.favoritesService.removeArtist(id, true);
  }
}
