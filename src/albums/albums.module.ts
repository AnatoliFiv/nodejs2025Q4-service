import { Module, forwardRef } from '@nestjs/common';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { AlbumsInMemoryRepository } from './repositories/albums.in-memory.repository';
import { TracksModule } from '../tracks/tracks.module';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
  imports: [forwardRef(() => TracksModule), forwardRef(() => FavoritesModule)],
  controllers: [AlbumsController],
  providers: [
    AlbumsService,
    {
      provide: 'IAlbumsRepository',
      useClass: AlbumsInMemoryRepository,
    },
  ],
  exports: [AlbumsService],
})
export class AlbumsModule {}
