import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { AlbumEntity } from './entities/album.typeorm.entity';
import { AlbumsTypeOrmRepository } from './repositories/albums.typeorm.repository';
import { TracksModule } from '../tracks/tracks.module';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AlbumEntity]),
    forwardRef(() => TracksModule),
    forwardRef(() => FavoritesModule),
  ],
  controllers: [AlbumsController],
  providers: [
    AlbumsService,
    AlbumsTypeOrmRepository,
    {
      provide: 'IAlbumsRepository',
      useClass: AlbumsTypeOrmRepository,
    },
  ],
  exports: [AlbumsService],
})
export class AlbumsModule {}
