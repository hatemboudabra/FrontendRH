import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable } from "rxjs";

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
deleteCandidat(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/Candidat/${id}`);
}

    scheduleInterview(
        candidatId: number,
        interviewDate: string,
        interviewTime: string,
        meetingLink: string
    ): Observable<void> {
        console.log('Scheduling interview for candidate ID:', candidatId);
        
        const params = new HttpParams()
            .set('candidatId', candidatId.toString())
            .set('interviewDate', interviewDate)
            .set('interviewTime', interviewTime)
            .set('meetingLink', meetingLink);

        return this.http.post<void>(`${this.apiUrl}/schedule`, null, { params })
            .pipe(
                catchError(error => {
                    console.error('Error scheduling interview:', error);
                    throw error;
                })
            );
    }

}