import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Certificat } from "../../data/certificat";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class CertificatService{
    private baseUrl = 'http://localhost:8082/';
constructor(private http:HttpClient){}

     addCertificat(certificat:Certificat):Observable<Certificat>
                {
                        return this.http.post<Certificat>(`${this.baseUrl}addCertif`,certificat)
                }

}