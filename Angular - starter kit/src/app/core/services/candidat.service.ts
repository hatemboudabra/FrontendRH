import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
  })
  export class CandidatService {
    private apiUrl = 'http://localhost:8082';
    constructor(private http : HttpClient){}
   
  postuler(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/postuler`, formData);
  }
  getCandidatures(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/allcandidat`);
}
  }