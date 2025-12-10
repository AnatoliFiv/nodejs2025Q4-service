import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlbumEntity } from '../entities/album.typeorm.entity';
import { Album } from '../entities/album.entity';
import { IAlbumsRepository } from './albums.repository.interface';

@Injectable()
export class AlbumsTypeOrmRepository implements IAlbumsRepository {
  constructor(
    @InjectRepository(AlbumEntity)
    private readonly repository: Repository<AlbumEntity>,
  ) {}

  async findAll(): Promise<Album[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => this.toDomain(entity));
  }

  async findById(id: string): Promise<Album | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async create(albumData: Omit<Album, 'id'>): Promise<Album> {
    const entity = this.repository.create({
      id: crypto.randomUUID(),
      ...albumData,
    });
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async update(id: string, updates: Partial<Album>): Promise<Album | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) return null;

    Object.assign(entity, updates);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== undefined && result.affected > 0;
  }

  private toDomain(entity: AlbumEntity): Album {
    const { id, name, year, artistId } = entity;
    return { id, name, year, artistId };
  }
}
