import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { TrackEntity } from './entities/track.typeorm.entity';
import { TracksTypeOrmRepository } from './repositories/tracks.typeorm.repository';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrackEntity]),
    forwardRef(() => FavoritesModule),
  ],
  controllers: [TracksController],
  providers: [
    TracksService,
    TracksTypeOrmRepository,
    {
      provide: 'ITracksRepository',
      useClass: TracksTypeOrmRepository,
    },
  ],
  exports: [TracksService],
})
export class TracksModule {}
