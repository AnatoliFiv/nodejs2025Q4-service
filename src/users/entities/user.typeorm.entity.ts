import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  login: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'int', default: 1, nullable: false })
  version: number;

  @Column({ type: 'bigint', nullable: false })
  createdAt: number;

  @Column({ type: 'bigint', nullable: false })
  updatedAt: number;
}
