import {
  IsString,
  IsNumber,
  IsUUID,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  year: number;

  @IsUUID()
  @IsOptional()
  artistId?: string | null;
}
