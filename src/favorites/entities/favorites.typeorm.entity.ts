import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('favorites')
export class FavoritesEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'jsonb', default: [], nullable: false })
  artists: string[];

  @Column({ type: 'jsonb', default: [], nullable: false })
  albums: string[];

  @Column({ type: 'jsonb', default: [], nullable: false })
  tracks: string[];
}
