import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class TeamService {
    private baseUrl = 'http://localhost:8082/';
    constructor(private http:HttpClient){}

    getTeamsByChef(chefId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}by-chef?chefId=${chefId}`);
    }
    createTeam(chefId: number, teamName: string, collaboratorIds: number[]): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}createTeam?chefId=${chefId}&teamName=${teamName}`, collaboratorIds);
    }

    updateTeam(teamId: number, newTeamName?: string, collaboratorIdsToAdd?: number[], collaboratorIdsToRemove?: number[]): Observable<any> {
        const params = new HttpParams()
          .set('teamId', teamId.toString())
          .set('newTeamName', newTeamName || '')
          // Convertir le tableau en chaîne séparée par des virgules
          .set('collaboratorIdsToAdd', (collaboratorIdsToAdd || []).join(',')) 
          .set('collaboratorIdsToRemove', (collaboratorIdsToRemove || []).join(',')); 
      
        return this.http.put<any>(`${this.baseUrl}updateTeam`, {}, { params });
      }
}