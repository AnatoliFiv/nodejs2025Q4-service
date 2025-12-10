import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('artists')
export class ArtistEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  grammy: boolean;
}
