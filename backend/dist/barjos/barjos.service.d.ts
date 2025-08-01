import { Barjo } from './entities/barjo.entity';
import { CreateBarjoDto, UpdateBarjoDto, CollectionStatsDto } from './dto/barjo.dto';
export declare class BarjosService {
    private barjos;
    constructor();
    private initializeBarjos;
    private generatePhotoUrl;
    findAll(): Barjo[];
    findOne(id: string): Barjo;
    create(createBarjoDto: CreateBarjoDto): Barjo;
    update(id: string, updateBarjoDto: UpdateBarjoDto): Barjo;
    remove(id: string): void;
    collectBarjo(id: string): Barjo;
    uncollectBarjo(id: string): Barjo;
    getCollection(): Barjo[];
    getStats(): CollectionStatsDto;
}
