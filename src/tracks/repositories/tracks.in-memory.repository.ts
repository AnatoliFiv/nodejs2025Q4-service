import { Injectable } from '@nestjs/common';
import { ITracksRepository } from './tracks.repository.interface';
import { Track } from '../entities/track.entity';

@Injectable()
export class TracksInMemoryRepository implements ITracksRepository {
  private tracks: Track[] = [];

  async findAll(): Promise<Track[]> {
    return [...this.tracks];
  }

  async findById(id: string): Promise<Track | null> {
    return this.tracks.find((track) => track.id === id) || null;
  }

  async create(trackData: Omit<Track, 'id'>): Promise<Track> {
    const newTrack: Track = {
      id: crypto.randomUUID(),
      ...trackData,
    };
    this.tracks.push(newTrack);
    return newTrack;
  }

  async update(id: string, updates: Partial<Track>): Promise<Track | null> {
    const index = this.tracks.findIndex((t) => t.id === id);
    if (index === -1) return null;

    this.tracks[index] = {
      ...this.tracks[index],
      ...updates,
    };
    return this.tracks[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.tracks.findIndex((t) => t.id === id);
    if (index === -1) return false;

    this.tracks.splice(index, 1);
    return true;
  }
}
