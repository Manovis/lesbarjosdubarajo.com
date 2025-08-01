import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreateBarjoDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;
}

export class UpdateBarjoDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;
}

export class CollectBarjoDto {
  @IsBoolean()
  isCollected: boolean;
}

export class BarjoResponseDto {
  id: string;
  name: string;
  description: string;
  photoUrl?: string;
  isCollected: boolean;
  collectedAt?: Date;
}

export class CollectionStatsDto {
  totalBarjos: number;
  collectedBarjos: number;
  completionRate: number;
}