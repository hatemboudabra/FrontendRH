import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MatchingService {
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  getFormattedMatchResults(offerId: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/formatted-match/${offerId}`, { responseType: 'text' });
  }
}