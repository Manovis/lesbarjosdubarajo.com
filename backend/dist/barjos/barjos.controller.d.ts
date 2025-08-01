import { BarjosService } from './barjos.service';
import { CreateBarjoDto, UpdateBarjoDto } from './dto/barjo.dto';
export declare class BarjosController {
    private readonly barjosService;
    constructor(barjosService: BarjosService);
    findAll(): {
        success: boolean;
        data: import("./entities/barjo.entity").Barjo[];
    };
    getStats(): {
        success: boolean;
        data: import("./dto/barjo.dto").CollectionStatsDto;
    };
    getCollection(): {
        success: boolean;
        data: import("./entities/barjo.entity").Barjo[];
    };
    findOne(id: string): {
        success: boolean;
        data: import("./entities/barjo.entity").Barjo;
    };
    create(createBarjoDto: CreateBarjoDto): {
        success: boolean;
        data: import("./entities/barjo.entity").Barjo;
        message: string;
    };
    update(id: string, updateBarjoDto: UpdateBarjoDto): {
        success: boolean;
        data: import("./entities/barjo.entity").Barjo;
        message: string;
    };
    collectBarjo(id: string): {
        success: boolean;
        data: import("./entities/barjo.entity").Barjo;
        message: string;
    };
    uncollectBarjo(id: string): {
        success: boolean;
        data: import("./entities/barjo.entity").Barjo;
        message: string;
    };
    remove(id: string): {
        success: boolean;
        message: string;
    };
}
