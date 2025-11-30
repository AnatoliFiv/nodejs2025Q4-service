import { Injectable } from '@nestjs/common';
import { IArtistsRepository } from './artists.repository.interface';
import { Artist } from '../entities/artist.entity';

@Injectable()
export class ArtistsInMemoryRepository implements IArtistsRepository {
  private artists: Artist[] = [];

  async findAll(): Promise<Artist[]> {
    return [...this.artists];
  }

  async findById(id: string): Promise<Artist | null> {
    return this.artists.find((artist) => artist.id === id) || null;
  }

  async create(artistData: Omit<Artist, 'id'>): Promise<Artist> {
    const newArtist: Artist = {
      id: crypto.randomUUID(),
      ...artistData,
    };
    this.artists.push(newArtist);
    return newArtist;
  }

  async update(id: string, updates: Partial<Artist>): Promise<Artist | null> {
    const index = this.artists.findIndex((a) => a.id === id);
    if (index === -1) return null;

    this.artists[index] = {
      ...this.artists[index],
      ...updates,
    };
    return this.artists[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.artists.findIndex((a) => a.id === id);
    if (index === -1) return false;

    this.artists.splice(index, 1);
    return true;
  }
}
