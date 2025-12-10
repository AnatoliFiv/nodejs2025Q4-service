import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoritesEntity } from '../entities/favorites.typeorm.entity';
import { Favorites } from '../entities/favorites.entity';
import { IFavoritesRepository } from './favorites.repository.interface';

@Injectable()
export class FavoritesTypeOrmRepository implements IFavoritesRepository {
  constructor(
    @InjectRepository(FavoritesEntity)
    private readonly repository: Repository<FavoritesEntity>,
  ) {}

  async findAll(): Promise<Favorites> {
    const entity = await this.getOrCreateEntity();
    return this.toDomain(entity);
  }

  async addTrack(id: string): Promise<void> {
    const entity = await this.getOrCreateEntity();
    if (!entity.tracks.includes(id)) {
      entity.tracks.push(id);
      await this.repository.save(entity);
    }
  }

  async removeTrack(id: string): Promise<void> {
    const entity = await this.getOrCreateEntity();
    entity.tracks = entity.tracks.filter((trackId) => trackId !== id);
    await this.repository.save(entity);
  }

  async addAlbum(id: string): Promise<void> {
    const entity = await this.getOrCreateEntity();
    if (!entity.albums.includes(id)) {
      entity.albums.push(id);
      await this.repository.save(entity);
    }
  }

  async removeAlbum(id: string): Promise<void> {
    const entity = await this.getOrCreateEntity();
    entity.albums = entity.albums.filter((albumId) => albumId !== id);
    await this.repository.save(entity);
  }

  async addArtist(id: string): Promise<void> {
    const entity = await this.getOrCreateEntity();
    if (!entity.artists.includes(id)) {
      entity.artists.push(id);
      await this.repository.save(entity);
    }
  }

  async removeArtist(id: string): Promise<void> {
    const entity = await this.getOrCreateEntity();
    entity.artists = entity.artists.filter((artistId) => artistId !== id);
    await this.repository.save(entity);
  }

  private async getOrCreateEntity(): Promise<FavoritesEntity> {
    const entities = await this.repository.find({ take: 1 });
    let entity = entities[0] || null;

    if (!entity) {
      entity = this.repository.create({
        id: crypto.randomUUID(),
        artists: [],
        albums: [],
        tracks: [],
      });
      await this.repository.save(entity);
    }

    return entity;
  }

  private toDomain(entity: FavoritesEntity): Favorites {
    const { artists, albums, tracks } = entity;
    return { artists, albums, tracks };
  }
}
