import { Injectable, NotFoundException } from '@nestjs/common';
import { Barjo } from './entities/barjo.entity';
import { CreateBarjoDto, UpdateBarjoDto, CollectionStatsDto } from './dto/barjo.dto';

@Injectable()
export class BarjosService {
  private barjos: Map<string, Barjo> = new Map();

  constructor() {
    // Initialisation avec les données de ton config.js
    this.initializeBarjos();
  }

  private initializeBarjos(): void {
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
      const barjo = new Barjo(id, data.name, data.description, photoUrl);
      this.barjos.set(id, barjo);
    });
  }

  private generatePhotoUrl(barjoId: string): string {
    return `images/${barjoId}.jpg`; // URL par défaut, on peut améliorer ça plus tard
  }

  findAll(): Barjo[] {
    return Array.from(this.barjos.values());
  }

  findOne(id: string): Barjo {
    const barjo = this.barjos.get(id);
    if (!barjo) {
      throw new NotFoundException(`Barjo with ID ${id} not found`);
    }
    return barjo;
  }

  create(createBarjoDto: CreateBarjoDto): Barjo {
    const barjo = new Barjo(
      createBarjoDto.id,
      createBarjoDto.name,
      createBarjoDto.description,
      createBarjoDto.photoUrl,
    );
    this.barjos.set(createBarjoDto.id, barjo);
    return barjo;
  }

  update(id: string, updateBarjoDto: UpdateBarjoDto): Barjo {
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

  remove(id: string): void {
    if (!this.barjos.has(id)) {
      throw new NotFoundException(`Barjo with ID ${id} not found`);
    }
    this.barjos.delete(id);
  }

  collectBarjo(id: string): Barjo {
    const barjo = this.findOne(id);
    barjo.collect();
    this.barjos.set(id, barjo);
    return barjo;
  }

  uncollectBarjo(id: string): Barjo {
    const barjo = this.findOne(id);
    barjo.uncollect();
    this.barjos.set(id, barjo);
    return barjo;
  }

  getCollection(): Barjo[] {
    return this.findAll().filter(barjo => barjo.isCollected);
  }

  getStats(): CollectionStatsDto {
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
}