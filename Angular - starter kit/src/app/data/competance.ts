export enum NiveauC{
    BEGINNER ='BEGINNER',
    INTERMEDIATE ='INTERMEDIATE',
    EXPERT = 'EXPERT'
}
export interface Competance{
    nom:string;
    niveauC:NiveauC;
    formationId:number;
}