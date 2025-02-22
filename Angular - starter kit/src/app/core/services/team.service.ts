import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
interface Collaborator {
  id: number;
  username: string;
}
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
      getTeamsWithUserCount(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}teamsusercount`);
    }
    getCollaboratorsByTeam(teamId: number): Observable<Collaborator[]> {
      return this.http.get<Collaborator[]>(`${this.baseUrl}${teamId}/collaborators`);
    }
    getChefInfoByTeam(teamId: number): Observable<{ chefId: number, chefUsername: string }> {
      return this.http.get<{ chefId: number, chefUsername: string }>(`${this.baseUrl}${teamId}/chefinfo`);
    }

    getTeamByTeamManager(chefId: number): Observable<any> {
      return this.http.get<any>(`${this.baseUrl}team/${chefId}`).pipe(
        map(response => {
          return {
            teamId: response.id,
            teamName: response.name,
            collaborators: response.collaborators.map((collaborator: any) => ({
              id: collaborator.id,
              name: collaborator.name
            }))
          };
        })
      );
    }
}