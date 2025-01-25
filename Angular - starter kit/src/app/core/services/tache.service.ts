import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Tache } from "../../data/tache.model";

@Injectable({ providedIn: 'root' })
export class TacheService {
    private baseUrl = 'http://localhost:8082/';

  constructor(private http: HttpClient) {}
getTachesByChef(chefId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}by-chef/${chefId}`);
  }
// getTacheById(id:number):Observable<Tache[]>{
//   return this.http.get<Tache[]>(`${this.baseUrl}/${id}`);
// }
}