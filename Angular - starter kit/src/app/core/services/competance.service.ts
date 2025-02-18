import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Competance } from "../../data/competance";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class CompetanceService{
    private baseUrl = 'http://localhost:8082/';
constructor(private http:HttpClient){}

          addCompetance(competance:Competance):Observable<Competance>
            {
                    return this.http.post<Competance>(`${this.baseUrl}addComp`,competance)
            }

     }