import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Reclamation } from "../../data/reclamation";
import { Observable } from "rxjs";
import { R } from "@fullcalendar/core/internal-common";

@Injectable({ providedIn: 'root' })
export class ReclamationService {
    private baseUrl = 'http://localhost:8082/';
    
    constructor(private http:HttpClient){}
    addReclamation(reclamation: Reclamation): Observable<Reclamation> {
        return this.http.post<Reclamation>(`${this.baseUrl}add`, reclamation);
    }

     getAllClaims():Observable<Reclamation[]>{
        return this.http.get<Reclamation[]>(`${this.baseUrl}allRec`)
     }
    getReclamationUserId(userId:number):Observable<Reclamation[]>{
             return this.http.get<Reclamation[]>(`${this.baseUrl}claims/${userId}`)
         }

         deleteclaims(id:number):Observable<void>{
            return this.http.delete<void>(`${this.baseUrl}Recl/${id}`)
         }
}