import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Formation } from "../../data/Formation";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class FormationService{
    private baseUrl = 'http://localhost:8082/';
    
    constructor(private http:HttpClient){}
    addFormation(formation:Formation):Observable<Formation>
    {
            return this.http.post<Formation>(`${this.baseUrl}`,formation)
    }
}