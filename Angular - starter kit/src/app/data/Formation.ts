import { Certificat } from "./certificat";
import { Competance } from "./competance";

export interface Formation{
    id : number;
    nom:String;
    description:String;
    userId:number;
    certificats?: Certificat[]; 
  competances?: Competance[]; 
}