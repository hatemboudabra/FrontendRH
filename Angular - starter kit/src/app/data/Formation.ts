import { Certificat } from "./certificat";
import { Competance } from "./competance";

export interface Formation{
    id : number;
    nom:string;
    description:string;
    userId:number;
    certificats?: Certificat[];
    competances?: Competance[]; 
}