import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Project } from "../../data/project";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ProjectService {
    private baseUrl = 'http://localhost:8082/';

  constructor(private http: HttpClient) {}

     addProject(project: Project): Observable<Project> {
      return this.http.post<Project>(`${this.baseUrl}addProject`, project);
    }
    getProjectUserId(chefId: number): Observable<Project[]> {
        return this.http.get<Project[]>(`${this.baseUrl}project/${chefId}`);
    }

    deleteProject(id:number):Observable<void>{
        return this.http.delete<void>(`${this.baseUrl}projects/${id}`)
     }

    updateProject(id :number , project:Project) : Observable<Project>{
        return this.http.put<Project>(`${this.baseUrl}project/${id}`,project)
       }
}