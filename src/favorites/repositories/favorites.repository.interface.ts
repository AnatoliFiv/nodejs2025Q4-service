import { Favorites } from '../entities/favorites.entity';

export interface IFavoritesRepository {
  findAll(): Promise<Favorites>;
  addTrack(id: string): Promise<void>;
  removeTrack(id: string): Promise<void>;
  addAlbum(id: string): Promise<void>;
  removeAlbum(id: string): Promise<void>;
  addArtist(id: string): Promise<void>;
  removeArtist(id: string): Promise<void>;
}
