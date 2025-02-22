
export enum Type{
    DOCUMENT = 'DOCUMENT',
    TRAINING = 'TRAINING',
    LEAVE = 'LEAVE',
    LOAN = 'LOAN',
    ADVANCE = 'ADVANCE'
}
export enum Status{
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}
export interface Demande{
    id : number;
    title: String ;
    description: string;
    date : Date;
    status:Status;
    type: Type;
    userId:number;

    documentType:string //document
    amount : number // pret, avance
    loanType : string //Pour pret
    nbrejour : number //congé
}


