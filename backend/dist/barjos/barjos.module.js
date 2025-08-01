"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarjosModule = void 0;
const common_1 = require("@nestjs/common");
const barjos_service_1 = require("./barjos.service");
const barjos_controller_1 = require("./barjos.controller");
let BarjosModule = class BarjosModule {
};
exports.BarjosModule = BarjosModule;
exports.BarjosModule = BarjosModule = __decorate([
    (0, common_1.Module)({
        controllers: [barjos_controller_1.BarjosController],
        providers: [barjos_service_1.BarjosService],
        exports: [barjos_service_1.BarjosService],
    })
], BarjosModule);
//# sourceMappingURL=barjos.module.js.map