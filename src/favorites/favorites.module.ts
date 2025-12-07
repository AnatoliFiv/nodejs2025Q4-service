import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { FavoritesEntity } from './entities/favorites.typeorm.entity';
import { FavoritesTypeOrmRepository } from './repositories/favorites.typeorm.repository';
import { ArtistsModule } from '../artists/artists.module';
import { AlbumsModule } from '../albums/albums.module';
import { TracksModule } from '../tracks/tracks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FavoritesEntity]),
    forwardRef(() => ArtistsModule),
    forwardRef(() => AlbumsModule),
    forwardRef(() => TracksModule),
  ],
  controllers: [FavoritesController],
  providers: [
    FavoritesService,
    FavoritesTypeOrmRepository,
    {
      provide: 'IFavoritesRepository',
      useClass: FavoritesTypeOrmRepository,
    },
  ],
  exports: [FavoritesService],
})
export class FavoritesModule {}
