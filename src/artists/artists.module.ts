import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';
import { ArtistEntity } from './entities/artist.typeorm.entity';
import { ArtistsTypeOrmRepository } from './repositories/artists.typeorm.repository';
import { AlbumsModule } from '../albums/albums.module';
import { TracksModule } from '../tracks/tracks.module';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArtistEntity]),
    forwardRef(() => AlbumsModule),
    forwardRef(() => TracksModule),
    forwardRef(() => FavoritesModule),
  ],
  controllers: [ArtistsController],
  providers: [
    ArtistsService,
    ArtistsTypeOrmRepository,
    {
      provide: 'IArtistsRepository',
      useClass: ArtistsTypeOrmRepository,
    },
  ],
  exports: [ArtistsService],
})
export class ArtistsModule {}
