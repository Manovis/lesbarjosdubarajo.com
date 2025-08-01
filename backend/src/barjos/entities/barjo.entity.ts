export class Barjo {
  id: string;
  name: string;
  description: string;
  photoUrl?: string;
  isCollected?: boolean;
  collectedAt?: Date;

  constructor(id: string, name: string, description: string, photoUrl?: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.photoUrl = photoUrl;
    this.isCollected = false;
    this.collectedAt = undefined;
  }

  collect(): void {
    this.isCollected = true;
    this.collectedAt = new Date();
  }

  uncollect(): void {
    this.isCollected = false;
    this.collectedAt = undefined;
  }
}