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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionStatsDto = exports.BarjoResponseDto = exports.CollectBarjoDto = exports.UpdateBarjoDto = exports.CreateBarjoDto = void 0;
const class_validator_1 = require("class-validator");
class CreateBarjoDto {
    id;
    name;
    description;
    photoUrl;
}
exports.CreateBarjoDto = CreateBarjoDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBarjoDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBarjoDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBarjoDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBarjoDto.prototype, "photoUrl", void 0);
class UpdateBarjoDto {
    name;
    description;
    photoUrl;
}
exports.UpdateBarjoDto = UpdateBarjoDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBarjoDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBarjoDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBarjoDto.prototype, "photoUrl", void 0);
class CollectBarjoDto {
    isCollected;
}
exports.CollectBarjoDto = CollectBarjoDto;
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CollectBarjoDto.prototype, "isCollected", void 0);
class BarjoResponseDto {
    id;
    name;
    description;
    photoUrl;
    isCollected;
    collectedAt;
}
exports.BarjoResponseDto = BarjoResponseDto;
class CollectionStatsDto {
    totalBarjos;
    collectedBarjos;
    completionRate;
}
exports.CollectionStatsDto = CollectionStatsDto;
//# sourceMappingURL=barjo.dto.js.map