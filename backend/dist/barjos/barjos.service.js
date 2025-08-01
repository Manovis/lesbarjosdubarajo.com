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
exports.BarjosService = void 0;
const common_1 = require("@nestjs/common");
const barjo_entity_1 = require("./entities/barjo.entity");
let BarjosService = class BarjosService {
    barjos = new Map();
    constructor() {
        this.initializeBarjos();
    }
    initializeBarjos() {
        const initialBarjos = {
            alain: {
                name: "Alain",
                description: "Le barjo le plus costaud, lui aussi il est tombé dans a la potion.",
            },
            axelle: {
                name: "Axelle",
                description: "Barjo legéndaire de type agoraphobe. Si vous la croisé, restez calme.",
            },
            cecilia: {
                name: "Cecilia",
                description: "Si elle ne t'a pas encore enguelé, c'est que tu ne lui as pas encore parlé.",
            },
            david: {
                name: "David",
                description: "Mateu pour les intimes, la calotte de tes morts mon copain.",
            },
            elodie: {
                name: "Elo",
                description: ".",
            },
            eva: {
                name: "Eva",
                description: ".",
            },
            fefe: {
                name: "Fefe",
                description: "Le seul gardois que l'on tolère. Si vous avez une envie de footing nocturne, n'hésitez pas.",
            },
            gael: {
                name: "Gael",
                description: "Si vous ne l'avez pas entendu râler c'est que vous ne lui avez pas encore parlé!",
            },
            guitou: {
                name: "Guitou",
                description: "Rare sont ceux qui l'ont vu sourire, souvent en déplacement pour éteindre les incendies avec son énorme lance.",
            },
            jeje: {
                name: "Jeje",
                description: "Toujours de bons conseils en matière de mécanique.",
            },
            jerem: {
                name: "Jerem",
                description: "Juste un BG.",
            },
            jr: {
                name: "JR",
                description: "Celui-ci les aimes mures alors mettez vos daronnes à l'abris.",
            },
            marvin: {
                name: "Marvin",
                description: "L'enfant de Tchernobyl, pas d'inquiétude si tu le croise entrain d'imiter le penseur.",
            },
            melodie: {
                name: "Mélodie",
                description: "La blonde originelle, 'Tu vas à Marrakech?! Mais tu devais aller au Maroc!'",
            },
            meras: {
                name: "Meras",
                description: "Ne le laissez jamais rentrer avant vous, il risque de vous laisser poiroter un moment...",
            },
            ophelie: {
                name: "Ophélie",
                description: "Les gens à l'ouest disent d'elle qu'elle est à l'ouest.",
            },
            sandra: {
                name: "Sandra",
                description: "Pas vue sur Sète depuis des années, n'est-ce pas si mal?",
            },
            thomas: {
                name: "Thomas",
                description: "Il a pris pour habitude de poser sa pêche un peu partout, et non il n'est pas maraicher.",
            },
        };
        Object.entries(initialBarjos).forEach(([id, data]) => {
            const photoUrl = this.generatePhotoUrl(id);
            const barjo = new barjo_entity_1.Barjo(id, data.name, data.description, photoUrl);
            this.barjos.set(id, barjo);
        });
    }
    generatePhotoUrl(barjoId) {
        return `images/${barjoId}.jpg`;
    }
    findAll() {
        return Array.from(this.barjos.values());
    }
    findOne(id) {
        const barjo = this.barjos.get(id);
        if (!barjo) {
            throw new common_1.NotFoundException(`Barjo with ID ${id} not found`);
        }
        return barjo;
    }
    create(createBarjoDto) {
        const barjo = new barjo_entity_1.Barjo(createBarjoDto.id, createBarjoDto.name, createBarjoDto.description, createBarjoDto.photoUrl);
        this.barjos.set(createBarjoDto.id, barjo);
        return barjo;
    }
    update(id, updateBarjoDto) {
        const barjo = this.findOne(id);
        if (updateBarjoDto.name) {
            barjo.name = updateBarjoDto.name;
        }
        if (updateBarjoDto.description) {
            barjo.description = updateBarjoDto.description;
        }
        if (updateBarjoDto.photoUrl) {
            barjo.photoUrl = updateBarjoDto.photoUrl;
        }
        this.barjos.set(id, barjo);
        return barjo;
    }
    remove(id) {
        if (!this.barjos.has(id)) {
            throw new common_1.NotFoundException(`Barjo with ID ${id} not found`);
        }
        this.barjos.delete(id);
    }
    collectBarjo(id) {
        const barjo = this.findOne(id);
        barjo.collect();
        this.barjos.set(id, barjo);
        return barjo;
    }
    uncollectBarjo(id) {
        const barjo = this.findOne(id);
        barjo.uncollect();
        this.barjos.set(id, barjo);
        return barjo;
    }
    getCollection() {
        return this.findAll().filter(barjo => barjo.isCollected);
    }
    getStats() {
        const allBarjos = this.findAll();
        const collectedBarjos = allBarjos.filter(barjo => barjo.isCollected);
        const completionRate = allBarjos.length > 0
            ? Math.round((collectedBarjos.length / allBarjos.length) * 100)
            : 0;
        return {
            totalBarjos: allBarjos.length,
            collectedBarjos: collectedBarjos.length,
            completionRate,
        };
    }
};
exports.BarjosService = BarjosService;
exports.BarjosService = BarjosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], BarjosService);
//# sourceMappingURL=barjos.service.js.map