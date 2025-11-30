import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { IFavoritesRepository } from './repositories/favorites.repository.interface';
import { ArtistsService } from '../artists/artists.service';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';
import { Artist } from '../artists/entities/artist.entity';
import { Album } from '../albums/entities/album.entity';
import { Track } from '../tracks/entities/track.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @Inject('IFavoritesRepository')
    private readonly favoritesRepository: IFavoritesRepository,
    private readonly artistsService: ArtistsService,
    private readonly albumsService: AlbumsService,
    private readonly tracksService: TracksService,
  ) {}

  async findAll(): Promise<{
    artists: Artist[];
    albums: Album[];
    tracks: Track[];
  }> {
    const favorites = await this.favoritesRepository.findAll();

    const artistsResults = await Promise.allSettled(
      favorites.artists.map((id) => this.artistsService.findById(id)),
    );
    const artists = artistsResults
      .filter((result) => result.status === 'fulfilled')
      .map((result) => (result as PromiseFulfilledResult<Artist>).value);

    const albumsResults = await Promise.allSettled(
      favorites.albums.map((id) => this.albumsService.findById(id)),
    );
    const albums = albumsResults
      .filter((result) => result.status === 'fulfilled')
      .map((result) => (result as PromiseFulfilledResult<Album>).value);

    const tracksResults = await Promise.allSettled(
      favorites.tracks.map((id) => this.tracksService.findById(id)),
    );
    const tracks = tracksResults
      .filter((result) => result.status === 'fulfilled')
      .map((result) => (result as PromiseFulfilledResult<Track>).value);

    return { artists, albums, tracks };
  }

  async addTrack(id: string): Promise<void> {
    try {
      await this.tracksService.findById(id);
    } catch (error) {
      throw new UnprocessableEntityException(
        `Track with id ${id} doesn't exist`,
      );
    }

    await this.favoritesRepository.addTrack(id);
  }

  async removeTrack(id: string, silent = false): Promise<void> {
    const favorites = await this.favoritesRepository.findAll();
    if (!favorites.tracks.includes(id)) {
      if (!silent) {
        throw new NotFoundException(`Track with id ${id} is not in favorites`);
      }
      return;
    }
    await this.favoritesRepository.removeTrack(id);
  }

  async addAlbum(id: string): Promise<void> {
    try {
      await this.albumsService.findById(id);
    } catch (error) {
      throw new UnprocessableEntityException(
        `Album with id ${id} doesn't exist`,
      );
    }

    await this.favoritesRepository.addAlbum(id);
  }

  async removeAlbum(id: string, silent = false): Promise<void> {
    const favorites = await this.favoritesRepository.findAll();
    if (!favorites.albums.includes(id)) {
      if (!silent) {
        throw new NotFoundException(`Album with id ${id} is not in favorites`);
      }
      return;
    }
    await this.favoritesRepository.removeAlbum(id);
  }

  async addArtist(id: string): Promise<void> {
    try {
      await this.artistsService.findById(id);
    } catch (error) {
      throw new UnprocessableEntityException(
        `Artist with id ${id} doesn't exist`,
      );
    }

    await this.favoritesRepository.addArtist(id);
  }

  async removeArtist(id: string, silent = false): Promise<void> {
    const favorites = await this.favoritesRepository.findAll();
    if (!favorites.artists.includes(id)) {
      if (!silent) {
        throw new NotFoundException(`Artist with id ${id} is not in favorites`);
      }
      return;
    }
    await this.favoritesRepository.removeArtist(id);
  }
}
