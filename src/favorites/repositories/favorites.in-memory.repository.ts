import { Injectable } from '@nestjs/common';
import { IFavoritesRepository } from './favorites.repository.interface';
import { Favorites } from '../entities/favorites.entity';

@Injectable()
export class FavoritesInMemoryRepository implements IFavoritesRepository {
  private favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  async findAll(): Promise<Favorites> {
    return { ...this.favorites };
  }

  async addTrack(id: string): Promise<void> {
    if (!this.favorites.tracks.includes(id)) {
      this.favorites.tracks.push(id);
    }
  }

  async removeTrack(id: string): Promise<void> {
    this.favorites.tracks = this.favorites.tracks.filter((t) => t !== id);
  }

  async addAlbum(id: string): Promise<void> {
    if (!this.favorites.albums.includes(id)) {
      this.favorites.albums.push(id);
    }
  }

  async removeAlbum(id: string): Promise<void> {
    this.favorites.albums = this.favorites.albums.filter((a) => a !== id);
  }

  async addArtist(id: string): Promise<void> {
    if (!this.favorites.artists.includes(id)) {
      this.favorites.artists.push(id);
    }
  }

  async removeArtist(id: string): Promise<void> {
    this.favorites.artists = this.favorites.artists.filter((a) => a !== id);
  }
}
