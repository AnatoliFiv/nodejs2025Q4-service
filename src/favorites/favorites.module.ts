import { Module, forwardRef } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { FavoritesInMemoryRepository } from './repositories/favorites.in-memory.repository';
import { ArtistsModule } from '../artists/artists.module';
import { AlbumsModule } from '../albums/albums.module';
import { TracksModule } from '../tracks/tracks.module';

@Module({
  imports: [
    forwardRef(() => ArtistsModule),
    forwardRef(() => AlbumsModule),
    forwardRef(() => TracksModule),
  ],
  controllers: [FavoritesController],
  providers: [
    FavoritesService,
    {
      provide: 'IFavoritesRepository',
      useClass: FavoritesInMemoryRepository,
    },
  ],
  exports: [FavoritesService],
})
export class FavoritesModule {}
