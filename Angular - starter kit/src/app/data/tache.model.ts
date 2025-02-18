export enum ComplexiteTache {
    SIMPLE = 'SIMPLE',
    INTERMEDIAIRE = 'INTERMEDIAIRE',
    AVANCEE = 'AVANCEE',
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    HIGH = "HIGH"
  }
  
  export enum StatusTache {
    NOT_ASSIGNED = 'NOT_ASSIGNED',
    ASSIGNED = 'ASSIGNED',
    INPROGRESS = 'INPROGRESS',
    COMPLETED = 'COMPLETED'
  }
  
  export interface Tache {
    id?:number
    title: string;
    description: string;
    dateDebut: Date;
    dateFin: Date;
    statusTache: StatusTache;
    complexite: ComplexiteTache;
    userId: number;
  }