import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable } from "rxjs";
interface Collaborator {
  id: number;
  username: string;
}
interface TeamInfo {
  teamId?: number;
  teamName?: string;
  role?: string;
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

    updateTeam(teamId: number, newTeamName?: string, collaboratorUsernamesToAdd?: string[], collaboratorUsernamesToRemove?: string[]): Observable<any> {
      const params = new HttpParams()
        .set('teamId', teamId.toString())
        .set('newTeamName', newTeamName || '')
        .set('collaboratorUsernamesToAdd', (collaboratorUsernamesToAdd || []).join(',')) 
        .set('collaboratorUsernamesToRemove', (collaboratorUsernamesToRemove || []).join(',')); 
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



    getTeamByCollaboratorId(collaboratorId: number): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseUrl}bycollaborator/${collaboratorId}`);
  }

  
  leaveTeam(teamId: number, collaboratorId: number): Observable<string> {
    const url = `${this.baseUrl}${teamId}/collaborators/${collaboratorId}`;
    return this.http.delete(url, { responseType: 'text' }).pipe(
        map(response => response),
        catchError(error => {
            if (error.status === 404) {
                throw new Error('Team or collaborator not found');
            } else if (error.status === 400) {
                throw new Error('Collaborator is not part of the team');
            } else {
                throw new Error('An error occurred while leaving the team');
            }
        })
    );
}

getTeamInfoByUserId(userId: number): Observable<TeamInfo> {
  return this.http.get<TeamInfo>(`${this.baseUrl}chatteam/${userId}`);
}
}