import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class EvaluationService{
      private baseUrl = 'http://localhost:8082/';
      constructor(private http:HttpClient){}

evaluateUser(chefId: number, collaboratorId: number): Observable<any> {
  const url = `${this.baseUrl}evaluateUser`;
  
  const params = new HttpParams()
    .set('chefId', chefId.toString())
    .set('collaboratorId', collaboratorId.toString());

  // Set response 'text' to accept non-JSON responses
  return this.http.post(url, {}, { 
    params,
    headers: { 'Content-Type': 'application/json' },
    responseType: 'text' 
  }).pipe(
    map(response => {
      try {
        return JSON.parse(response); 
      } catch {
        return response; 
      }
    })
  );
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