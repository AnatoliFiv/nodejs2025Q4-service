import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrackEntity } from '../entities/track.typeorm.entity';
import { Track } from '../entities/track.entity';
import { ITracksRepository } from './tracks.repository.interface';

@Injectable()
export class TracksTypeOrmRepository implements ITracksRepository {
  constructor(
    @InjectRepository(TrackEntity)
    private readonly repository: Repository<TrackEntity>,
  ) {}

  async findAll(): Promise<Track[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => this.toDomain(entity));
  }

  async findById(id: string): Promise<Track | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async create(trackData: Omit<Track, 'id'>): Promise<Track> {
    const entity = this.repository.create({
      id: crypto.randomUUID(),
      ...trackData,
    });
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async update(id: string, updates: Partial<Track>): Promise<Track | null> {
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

  private toDomain(entity: TrackEntity): Track {
    const { id, name, duration, artistId, albumId } = entity;
    return { id, name, duration, artistId, albumId };
  }
}
