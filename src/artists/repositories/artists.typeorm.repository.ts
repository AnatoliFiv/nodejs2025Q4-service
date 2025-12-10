import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArtistEntity } from '../entities/artist.typeorm.entity';
import { Artist } from '../entities/artist.entity';
import { IArtistsRepository } from './artists.repository.interface';

@Injectable()
export class ArtistsTypeOrmRepository implements IArtistsRepository {
  constructor(
    @InjectRepository(ArtistEntity)
    private readonly repository: Repository<ArtistEntity>,
  ) {}

  async findAll(): Promise<Artist[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => this.toDomain(entity));
  }

  async findById(id: string): Promise<Artist | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async create(artistData: Omit<Artist, 'id'>): Promise<Artist> {
    const entity = this.repository.create({
      id: crypto.randomUUID(),
      ...artistData,
    });
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async update(id: string, updates: Partial<Artist>): Promise<Artist | null> {
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

  private toDomain(entity: ArtistEntity): Artist {
    const { id, name, grammy } = entity;
    return { id, name, grammy };
  }
}
