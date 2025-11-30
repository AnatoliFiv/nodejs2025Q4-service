import { Module, forwardRef } from '@nestjs/common';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';
import { ArtistsInMemoryRepository } from './repositories/artists.in-memory.repository';
import { AlbumsModule } from '../albums/albums.module';
import { TracksModule } from '../tracks/tracks.module';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
  imports: [
    forwardRef(() => AlbumsModule),
    forwardRef(() => TracksModule),
    forwardRef(() => FavoritesModule),
  ],
  controllers: [ArtistsController],
  providers: [
    ArtistsService,
    {
      provide: 'IArtistsRepository',
      useClass: ArtistsInMemoryRepository,
    },
  ],
  exports: [ArtistsService],
})
export class ArtistsModule {}
