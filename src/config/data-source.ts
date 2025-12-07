import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { UserEntity } from '../users/entities/user.typeorm.entity';
import { ArtistEntity } from '../artists/entities/artist.typeorm.entity';
import { AlbumEntity } from '../albums/entities/album.typeorm.entity';
import { TrackEntity } from '../tracks/entities/track.typeorm.entity';
import { FavoritesEntity } from '../favorites/entities/favorites.typeorm.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'home_library',
  entities: [
    UserEntity,
    ArtistEntity,
    AlbumEntity,
    TrackEntity,
    FavoritesEntity,
  ],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});
