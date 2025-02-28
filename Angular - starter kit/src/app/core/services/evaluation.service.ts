import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class EvaluationService{
      private baseUrl = 'http://localhost:8082/';
      constructor(private http:HttpClient){}

      evaluateUser(chefId: number, collaboratorId: number): Observable<string> {
        const url = `${this.baseUrl}evaluateUser`; 
        const params = { chefId: chefId.toString(), collaboratorId: collaboratorId.toString() }; 
        return this.http.post<string>(url, {}, { params }); 
    }
    getCollaboratorEvaluationNote(collaboratorId: number): Observable<string> {
        const url = `${this.baseUrl}collaborator/${collaboratorId}`;
        return this.http.get(url, { responseType: 'text' });
      }
    getAllUsersWithAverageNote(): Observable<{ username: string, averageNote: number }[]> {
        const url = `${this.baseUrl}all-users-notes`;
        return this.http.get<{ username: string, averageNote: number }[]>(url);
    }
}