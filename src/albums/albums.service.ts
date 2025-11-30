import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IAlbumsRepository } from './repositories/albums.repository.interface';
import { Album } from './entities/album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { TracksService } from '../tracks/tracks.service';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class AlbumsService {
  constructor(
    @Inject('IAlbumsRepository')
    private readonly albumsRepository: IAlbumsRepository,
    private readonly tracksService: TracksService,
    private readonly favoritesService: FavoritesService,
  ) {}

  async findAll(): Promise<Album[]> {
    return this.albumsRepository.findAll();
  }

  async findById(id: string): Promise<Album> {
    const album = await this.albumsRepository.findById(id);
    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
    return album;
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    return this.albumsRepository.create({
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId ?? null,
    });
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    await this.findById(id);
    const updatedAlbum = await this.albumsRepository.update(id, updateAlbumDto);
    if (!updatedAlbum) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
    return updatedAlbum;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.albumsRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }

    await this.tracksService.removeAlbumReferences(id);
    await this.favoritesService.removeAlbum(id, true);
  }

  async removeArtistReferences(artistId: string): Promise<void> {
    const albums = await this.albumsRepository.findAll();
    const albumsToUpdate = albums.filter((a) => a.artistId === artistId);

    await Promise.allSettled(
      albumsToUpdate.map((album) =>
        this.albumsRepository.update(album.id, { artistId: null }),
      ),
    );
  }
}
