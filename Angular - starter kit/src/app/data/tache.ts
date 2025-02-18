export enum StatusTache {
    ASSIGNED,
    INPROGRESS,
    COMPLETED
}

export enum ComplexiteTache {
    SIMPLE,
    INTERMEDIAIRE,
    AVANCEE
}
export interface Tache{
    title: string;
    description: string;
    dateDebut: Date;
    dateFin: Date;
    statusTache: StatusTache;
    complexite: ComplexiteTache;
    userId: number;
    
}