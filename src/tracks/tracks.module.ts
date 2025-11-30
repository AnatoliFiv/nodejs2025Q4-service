import { Module, forwardRef } from '@nestjs/common';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { TracksInMemoryRepository } from './repositories/tracks.in-memory.repository';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
  imports: [forwardRef(() => FavoritesModule)],
  controllers: [TracksController],
  providers: [
    TracksService,
    {
      provide: 'ITracksRepository',
      useClass: TracksInMemoryRepository,
    },
  ],
  exports: [TracksService],
})
export class TracksModule {}
