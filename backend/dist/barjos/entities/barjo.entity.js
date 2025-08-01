"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Barjo = void 0;
class Barjo {
    id;
    name;
    description;
    photoUrl;
    isCollected;
    collectedAt;
    constructor(id, name, description, photoUrl) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.photoUrl = photoUrl;
        this.isCollected = false;
        this.collectedAt = undefined;
    }
    collect() {
        this.isCollected = true;
        this.collectedAt = new Date();
    }
    uncollect() {
        this.isCollected = false;
        this.collectedAt = undefined;
    }
}
exports.Barjo = Barjo;
//# sourceMappingURL=barjo.entity.js.map