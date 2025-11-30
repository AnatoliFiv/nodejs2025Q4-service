import { Injectable } from '@nestjs/common';
import { IAlbumsRepository } from './albums.repository.interface';
import { Album } from '../entities/album.entity';

@Injectable()
export class AlbumsInMemoryRepository implements IAlbumsRepository {
  private albums: Album[] = [];

  async findAll(): Promise<Album[]> {
    return [...this.albums];
  }

  async findById(id: string): Promise<Album | null> {
    return this.albums.find((album) => album.id === id) || null;
  }

  async create(albumData: Omit<Album, 'id'>): Promise<Album> {
    const newAlbum: Album = {
      id: crypto.randomUUID(),
      ...albumData,
    };
    this.albums.push(newAlbum);
    return newAlbum;
  }

  async update(id: string, updates: Partial<Album>): Promise<Album | null> {
    const index = this.albums.findIndex((a) => a.id === id);
    if (index === -1) return null;

    this.albums[index] = {
      ...this.albums[index],
      ...updates,
    };
    return this.albums[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.albums.findIndex((a) => a.id === id);
    if (index === -1) return false;

    this.albums.splice(index, 1);
    return true;
  }
}
