export enum ComplexiteTache {
    SIMPLE = 'SIMPLE',
    INTERMEDIAIRE = 'INTERMEDIAIRE',
    AVANCEE = 'AVANCEE',
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    HIGH = "HIGH"
  }
  
  export enum StatusTache {
    ASSIGNED = 'ASSIGNED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED'
  }
  
  export interface Tache {
    title: string;
    description: string;
    dateDebut: Date;
    dateFin: Date;
    statusTache: StatusTache;
    complexite: ComplexiteTache;
    userId: number;
  }