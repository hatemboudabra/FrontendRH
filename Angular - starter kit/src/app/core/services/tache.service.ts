import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Tache } from "../../data/tache.model";
import { an } from "@fullcalendar/core/internal-common";

@Injectable({ providedIn: 'root' })
export class TacheService {
    private baseUrl = 'http://localhost:8082/';

  constructor(private http: HttpClient) {}
getTachesByChef(chefId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}by-chef/${chefId}`);
  }
  getTacheById(id: number): Observable<Tache> {
    return this.http.get<Tache>(`${this.baseUrl}Tache/${id}`);
  }
  

 assignTacheToCollaborator(tacheId: number, chefId: number, collaboratorId: number): Observable<Tache> {
  const params = new HttpParams()
    .set('chefId', chefId.toString())
    .set('collaboratorId', collaboratorId.toString());

  return this.http.put<Tache>(`${this.baseUrl}${tacheId}/assign`, {}, { params });
}
addTache(chefId: number, tacheDTO: Tache): Observable<Tache> {
  return this.http.post<Tache>(`${this.baseUrl}add-by-chef/${chefId}`, tacheDTO);
}

getAssignedTachesByChef(chefId: number, collaboratorId: number): Observable<Tache[]> {
  return this.http.get<Tache[]>(`${this.baseUrl}chef/${chefId}/collaborator/${collaboratorId}/taches`);
}

updateTacheStatus(id: number, newStatus: string): Observable<Tache> {
  return this.http.put<Tache>(`${this.baseUrl}${id}/status`, null, {
    params: { newStatus: newStatus }
  });
}


}
