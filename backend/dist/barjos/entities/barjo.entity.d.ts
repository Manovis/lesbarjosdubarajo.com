export declare class Barjo {
    id: string;
    name: string;
    description: string;
    photoUrl?: string;
    isCollected?: boolean;
    collectedAt?: Date;
    constructor(id: string, name: string, description: string, photoUrl?: string);
    collect(): void;
    uncollect(): void;
}
