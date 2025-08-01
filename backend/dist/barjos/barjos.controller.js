"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarjosController = void 0;
const common_1 = require("@nestjs/common");
const barjos_service_1 = require("./barjos.service");
const barjo_dto_1 = require("./dto/barjo.dto");
let BarjosController = class BarjosController {
    barjosService;
    constructor(barjosService) {
        this.barjosService = barjosService;
    }
    findAll() {
        return {
            success: true,
            data: this.barjosService.findAll(),
        };
    }
    getStats() {
        return {
            success: true,
            data: this.barjosService.getStats(),
        };
    }
    getCollection() {
        return {
            success: true,
            data: this.barjosService.getCollection(),
        };
    }
    findOne(id) {
        return {
            success: true,
            data: this.barjosService.findOne(id),
        };
    }
    create(createBarjoDto) {
        return {
            success: true,
            data: this.barjosService.create(createBarjoDto),
            message: 'Barjo créé avec succès',
        };
    }
    update(id, updateBarjoDto) {
        return {
            success: true,
            data: this.barjosService.update(id, updateBarjoDto),
            message: 'Barjo mis à jour avec succès',
        };
    }
    collectBarjo(id) {
        return {
            success: true,
            data: this.barjosService.collectBarjo(id),
            message: '🎉 Nouveau Barjo capturé !',
        };
    }
    uncollectBarjo(id) {
        return {
            success: true,
            data: this.barjosService.uncollectBarjo(id),
            message: 'Barjo retiré de la collection',
        };
    }
    remove(id) {
        this.barjosService.remove(id);
        return {
            success: true,
            message: 'Barjo supprimé avec succès',
        };
    }
};
exports.BarjosController = BarjosController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BarjosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BarjosController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('collection'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BarjosController.prototype, "getCollection", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BarjosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [barjo_dto_1.CreateBarjoDto]),
    __metadata("design:returntype", void 0)
], BarjosController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, barjo_dto_1.UpdateBarjoDto]),
    __metadata("design:returntype", void 0)
], BarjosController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/collect'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BarjosController.prototype, "collectBarjo", null);
__decorate([
    (0, common_1.Post)(':id/uncollect'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BarjosController.prototype, "uncollectBarjo", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BarjosController.prototype, "remove", null);
exports.BarjosController = BarjosController = __decorate([
    (0, common_1.Controller)('barjos'),
    __metadata("design:paramtypes", [barjos_service_1.BarjosService])
], BarjosController);
//# sourceMappingURL=barjos.controller.js.map