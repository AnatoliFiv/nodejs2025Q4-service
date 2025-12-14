import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { AlbumsModule } from './albums/albums.module';
import { TracksModule } from './tracks/tracks.module';
import { FavoritesModule } from './favorites/favorites.module';
import { LoggingModule } from './common/logging/logging.module';
import { AuthModule } from './auth/auth.module';
import { UserEntity } from './users/entities/user.typeorm.entity';
import { ArtistEntity } from './artists/entities/artist.typeorm.entity';
import { AlbumEntity } from './albums/entities/album.typeorm.entity';
import { TrackEntity } from './tracks/entities/track.typeorm.entity';
import { FavoritesEntity } from './favorites/entities/favorites.typeorm.entity';
import { LoggingMiddleware } from './common/logging/logging.middleware';

config();

@Module({
  imports: [
    LoggingModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        UserEntity,
        ArtistEntity,
        AlbumEntity,
        TrackEntity,
        FavoritesEntity,
      ],
      synchronize: false,
      logging: process.env.NODE_ENV === 'development',
    }),
    UsersModule,
    ArtistsModule,
    AlbumsModule,
    TracksModule,
    FavoritesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
