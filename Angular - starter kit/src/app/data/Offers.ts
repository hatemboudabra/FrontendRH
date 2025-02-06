export interface Offers {
    id: number; 
    title: string;
    description: string;
    salary: number;
    contractType: string;
    publicationDate: Date;
    expirationDate: Date;
    createdById: number;
}