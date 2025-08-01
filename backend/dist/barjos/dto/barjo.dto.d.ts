export declare class CreateBarjoDto {
    id: string;
    name: string;
    description: string;
    photoUrl?: string;
}
export declare class UpdateBarjoDto {
    name?: string;
    description?: string;
    photoUrl?: string;
}
export declare class CollectBarjoDto {
    isCollected: boolean;
}
export declare class BarjoResponseDto {
    id: string;
    name: string;
    description: string;
    photoUrl?: string;
    isCollected: boolean;
    collectedAt?: Date;
}
export declare class CollectionStatsDto {
    totalBarjos: number;
    collectedBarjos: number;
    completionRate: number;
}
